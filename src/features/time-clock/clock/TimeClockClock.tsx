import { MomentInput } from "moment";
import moment from 'moment-timezone'
import React, { Context, useContext, useEffect, useState } from "react";
import Moment from "react-moment";
import { Timetable } from "../../../models/Timetable";
import { User } from "../../../models/Users";
import { deleteTimetableById, getTimetableById, saveTimetable } from "../../../services/TimeTable";
import { StoreContext } from "../../../store/Store";
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import { Button } from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid'
import AlertDialogBox from "../../../assets/alert-dialog-box/alert-dialog-box";

export interface ClockProps {}
 
const Clock: React.FunctionComponent<ClockProps> = () => {
    moment.tz.setDefault("America/New_York");

    const [user,] = useContext(StoreContext as Context<[User,Function]>)
    const [timetable, setTimetable] = useState<Timetable[]>()
    const [timeToDelete, setTimeToDelete] = useState("") 
    const [uuid, setUuid] = useState("") 

    const [dateInput, setDateInput] = useState(moment().tz(moment.tz.guess(true)).format())
    const [timeInput, setTimeInput] = useState(moment().tz(moment.tz.guess(true)).format())
    const [dialogBox, setDialogBox] = useState(false)
    const [update, setUpdate] = useState(true)

    useEffect(() => {
        const employeeId = user.id 
        if (employeeId && update) {
            getTimetableById(employeeId)
                .then((data: Timetable[]) => {
                    if (data) {
                        setTimetable(sort(data))
                        setUpdate(false)
                    }
                })
        }
    }, [user.id, timeToDelete, uuid, update]);

    const handleDateChange = (selectedDate: MomentInput) => {
        const dateIso = moment.utc(selectedDate).local().toISOString()
        setDateInput(dateIso)
    }
    const handleTimeChange = (selectedTime: MomentInput) => {
        const timeIso = moment.utc(selectedTime).local().toISOString()
        setTimeInput(timeIso)
    }

    const timeClicked = (id: Timetable["id"]) => {
        setDialogBox(true)
        setTimeToDelete(id)
    }

    const handleDelete = () => {
        setDialogBox(false)
        deleteTimetableById(timeToDelete)
            .then(() => {
                setTimeToDelete("") // reset
                setUpdate(true)
            })
    }

    const handleDontDelete = () => {
        setTimeToDelete("")
        setDialogBox(false)
    }

    const saveTime = () => {
        if (user.id) {
            const id = uuidv4()
            const data: Timetable = {
                id: id,
                user_id: user.id || "",
                punch: moment(dateInput).format("YYYY-MM-DD") + "T" + moment(timeInput).format("HH:mm:00")
            }
            saveTimetable(data)
               .then((r) => {
                    setUuid(id)
                    setUpdate(true)
                })
        }
    }

    const onSubmit = (event?: any) => {
        event.preventDefault()
        saveTime()
    }

    const sort = (timetable: Timetable[]) => {
        return timetable
                .sort((a,b) => moment(a.punch).isBefore(b.punch) ? -1 : moment(a.punch).isAfter(b.punch) ? 1 : 0)
                .sort((a,b) => Number(moment(a.punch).format('MDD')) < Number(moment(b.punch).format('MDD')) ? 1 : Number(moment(a.punch).format('MDD')) > Number(moment(b.punch).format('MDD')) ? -1: 0)
    }

    const getTimetable = () => {
        if (!timetable) {
            return
        }
        const moments: JSX.Element[] = []
        let last = '', pos = 'odd', day = ''
        timetable.map((time, index) => {
            if(last !== time.punch.replace(/.*?(\d{2})T.*/, '$1')) {
                day = '';
                if ((moment(new Date()).format('YYYYMMDD') === moment(time.punch).format('YYYYMMDD'))) {
                    day = 'today'
                } else if ((moment(new Date()).subtract(1, 'day').format('YYYYMMDD') === moment(time.punch).format('YYYYMMDD'))) {
                    day = 'yesterday'
                }
                moments.push(<span className={`header ${day}`} key={`time-header-${time.id}-${index}`}><Moment date={time.punch} format="ddd, MMM DD" /></span>)
                last = time.punch.replace(/.*?(\d{2})T.*/, '$1')
                pos = 'odd'
            }
            moments.push(<span onClick={e => {timeClicked(time.id)}} className={`column column-${pos}`} key={`time-column-${time.id}`}><Moment date={time.punch} format="HH:mm" /></span>)
            pos = pos === 'odd' ? 'even' : 'odd'
            return moments
        })
        return (<>{moments}</>)
    }

    return (
        <>
        <div className="row pt-5">
            <div className="col-md-5 px-lg-5 pl-md-5 pb-5">
                <AlertDialogBox state={[dialogBox, setDialogBox]}>
                    <Button onClick={handleDelete} color="primary">
                        I do
                    </Button>
                    <Button onClick={handleDontDelete} color="secondary">
                        Cancel
                    </Button>
                </AlertDialogBox>
                <form className="col-12 col-md-11 pl-0 " onSubmit={onSubmit}>
                    <div>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/DD/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date"
                            value={dateInput}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </div>
                    <div className="mt-4">
                        <KeyboardTimePicker
                            ampm={false}
                            margin="normal"
                            id="time-picker"
                            label="Time"
                            value={timeInput}
                            onChange={handleTimeChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </div>
                    <div className="mt-5">
                        <Button type='submit' color='primary' >Punch in/out</Button>
                    </div>
                </form>
            </div>
            <div className="timetables col-md-7 pr-md-5">
                <div className="timetable">
                    {getTimetable()}
                </div>
            </div>
        </div>
        </>
    );
}
 
export default Clock;