import moment from 'moment-timezone'
import Moment from "react-moment";
import NumberFormat from 'react-number-format'
import React, { Context, useContext, useEffect, useState } from "react";
import { MomentInput } from "moment";
import { Button } from "@material-ui/core";
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import { v4 as uuidv4 } from 'uuid'

import { Timetable } from "../../../models/Timetable";
import { User } from "../../../models/Users";

import { deleteTimetableById, getTimetableById, saveTimetable } from "../../../services/TimeTable";
import { StoreContext } from "../../../store/Store";
import AlertDialogBox from "../../../assets/alert-dialog-box/alert-dialog-box";
import numeral from 'numeral';
import { useHistory } from 'react-router-dom';
 
const TimeClockClock: React.FunctionComponent<JSX.Element[]> = () => {
    moment.tz.setDefault("America/New_York");

    const [user,] = useContext(StoreContext as Context<[User,React.Dispatch<React.SetStateAction<User|null>>]>)
    const [timetable, setTimetable] = useState<Timetable[]>()
    const [timeToDelete, setTimeToDelete] = useState("") 
    const [uuid, setUuid] = useState("") 

    const [dateInput, setDateInput] = useState(moment().tz(moment.tz.guess(true)).format())
    const [timeInput, setTimeInput] = useState(moment().tz(moment.tz.guess(true)).format())
    const [totals, setTotals] = useState<{[key:string]:number}|null>(null)
    const [dialogBox, setDialogBox] = useState(false)
    const [update, setUpdate] = useState(true)
    const history = useHistory()

    useEffect(() => {
        const employeeId = user && user.id
        if (employeeId && update) {
            getTimetableById(employeeId)
                .then((data: Timetable[]) => {
                    if (data) {
                        const sortedData = sort(data)
                        const calcResults = calcTotals(sortedData)
                        setTotals(calcResults)
                        setTimetable(sortedData)
                        setUpdate(false)
                    }
                })
        }
    }, [user, timeToDelete, uuid, update]);

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
               .then(() => {
                    setUuid(id)
                    setUpdate(true)
                })
        }
    }

    const calcTotals = (time: Timetable[]) => {
        const timeTotals: {[key:string]: number} = {}
        let sum = 0;
        for(let i = 0; i < time.length; i++) {
            const month: string = moment(time[i].punch).format('YYYYMM')
            const current: string = moment(time[i].punch).format('YYYYMMDD')
            const next: string = (time[i+1] && time[i+1].punch) ? moment(time[i+1].punch).format('YYYYMMDD') : ''
            if (current === next) {
                const duration = moment.duration(moment(time[i+1].punch).diff(time[i].punch));
                sum = numeral(duration.asHours()).value() || 0
                timeTotals[current] = timeTotals[current] ? (numeral(timeTotals[current]).add(sum).value()) as number : sum
                i++
            } else {
                continue;
            }
            timeTotals[month] = timeTotals[month] ? (numeral(timeTotals[month]).add(sum).value()) as number : sum
        }
        return timeTotals
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
        const today = moment()
        const yesterday = moment(today).subtract(1, 'day')
        let lastDay = '', lastMonth = '', pos = 'odd', day = ''
        timetable.map((time, index) => {
            const formatedMonth = moment(time.punch).format('YYYYMM')
            if (lastMonth !== moment(time.punch).format('YYYYMM')) {
                moments.push(<span className={`main-header ${day}`} key={`main-time-header-${time.id}-${index}`}><span className="time-header"><Moment date={time.punch} format="MMMM" /></span><span className="total">{totals && <NumberFormat value={totals[formatedMonth]} displayType={'text'} decimalScale={2} thousandSeparator={true} suffix={' hours'} />}</span></span>)
                lastMonth = moment(time.punch).format('YYYYMM')
            }
            if (lastDay !== moment(time.punch).format('DD')) {
                const formatedDate = moment(time.punch).format('YYYYMMDD')
                day = '';
                if ((today.format('YYYYMMDD') === formatedDate)) {
                    day = 'today'
                } else if ((yesterday.format('YYYYMMDD') === formatedDate)) {
                    day = 'yesterday'
                }
                moments.push(<span className={`header ${day}`} key={`time-header-${time.id}-${index}`}><span className="time-header"><Moment date={time.punch} format="ddd, MMM DD" /></span><span className="total">{totals && <NumberFormat value={totals[formatedDate]} displayType={'text'} decimalScale={2} thousandSeparator={true} suffix={' hours'} />}</span></span>)
                lastDay = moment(time.punch).format('DD')
                pos = 'odd'
            }
            moments.push(<span onClick={() => {timeClicked(time.id)}} className={`column column-${pos}`} key={`time-column-${time.id}`}><Moment date={time.punch} format="HH:mm" /></span>)
            pos = pos === 'odd' ? 'even' : 'odd'
            return moments
        })
        return (<>{moments}</>)
    }

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        saveTime()
    }

    const showForm = (): JSX.Element => {
        if (user && user.name) {
            return (
                <div className="row pt-5">
                    <div className="col-md-5 px-lg-5 pl-md-5 pb-5">
                        <AlertDialogBox state={[dialogBox, setDialogBox]}>
                            <Button onClick={handleDelete} color="primary">
                                Yes
                            </Button>
                            <Button onClick={handleDontDelete} color="secondary">
                                Cancel
                            </Button>
                        </AlertDialogBox>
                        <form className="time-clock-form col-12 col-md-11 pl-0 " onSubmit={onSubmit}>
                            <div>
                                <KeyboardDatePicker
                                    className="date-fld"
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
                                    className="time-fld"
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
            )
        }
        return (
            <div className="row pt-5">
                <div className="col-md-5 px-lg-5 pl-md-5 pb-5">
                    <p>Please sign in to continue.</p>
                    <p>
                        <Button onClick={() => history.push("/")} color="primary">
                            Go back to the home page
                        </Button>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            {showForm()}
        </>
    );
}
 
export default TimeClockClock;