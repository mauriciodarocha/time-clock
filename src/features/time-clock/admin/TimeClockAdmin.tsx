import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Snackbar, TextField } from "@material-ui/core";
import React, { Context, useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { User } from "../../../models/Users";
import { StoreContext } from "../../../store/Store";
import { deleteUserById, getUser, getUsers, saveUser } from "../../../services/Users";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { v4 as uuidv4 } from 'uuid'

enum AlertType {
    Success,
    Warning,
    Info,
    Error,
    None
}

type UserLevel = 'employee' | 'admin' | ''

interface UserDataForm {
    employeeId: string,
    employeeName: string,
    employeePassword: string,
    employeeUserLevel: string
}

export interface TimeClockAdminProps {}
 
const TimeClockAdmin: React.FunctionComponent<TimeClockAdminProps> = () => {

    const history = useHistory()
    const {register, handleSubmit, formState} = useForm()
    const [user,] = useContext(StoreContext as Context<[User,Function]>)
    const [messageType, setMessageType] = useState(AlertType.None);
    const [userLevel, setUserLevel] = useState<UserLevel>("");
    const [message, setMessage] = useState("");
    const [usersList, setUsersList] = useState(<></>);
    const [usersListUpdate, setUsersListUpdate] = useState(true);

    const getUsersList = useCallback(() => {
        getUsers()
            .then((users: User[]) => {
                let content:JSX.Element = <div></div>;
                let buffer:JSX.Element[] = []
                if (users && users.length) {
                    buffer.push(<div className="list-header" key={`list-header`}>
                        <span className="list-employee-id">ID</span>
                        <span className="list-name">Name</span>
                        <span className="list-password">Password</span>
                        <span className="list-user-level">User Level</span>
                    </div>)
                    users.forEach((user) => {
                        buffer.push(<div onClick={() => handleUserDelete(user.id)} key={`list-item-${user.id}`} className="list-item">
                            <span className="list-employee-id">{user.employee_id}</span>
                            <span className="list-name">{user.name}</span>
                            <span className="list-password">{user.password}</span>
                            <span className="list-user-level">{user.user_level}</span>
                        </div>)
                    })
                    content = <div className="users-list">{buffer.flat()}</div>
                } else {
                    buffer.push(<div className="users-list-empty">No user registered yet.</div>)
                }
                setUsersList(content)
            })
    },[])

    useEffect(() => {
        if (Object.keys(formState.errors).length && formState.isSubmitted) {
            setMessageType(AlertType.Warning)
            setMessage("All fields are required.")
            formState.errors = {}
        }
        if (usersListUpdate) {
            getUsersList()
            setUsersListUpdate(false)
        }
    }, [formState, getUsersList, usersListUpdate]);

    const onSubmit = ({employeeId, employeeName, employeePassword, employeeUserLevel}: UserDataForm) => {
        getUser(employeeId)    
            .then((data: User[]) => {
                if (data && data.length) {
                    setMessage("User exists. Please change employee's id.")
                    setMessageType(AlertType.Warning)
                } else {
                    const id = uuidv4()
                    const today = new Date().toISOString()
                    saveUser({
                            id: id,
                            since: today,
                            employee_id: employeeId, 
                            name: employeeName,
                            password: employeePassword, 
                            user_level: employeeUserLevel
                        })
                        .then(() => {
                            setMessageType(AlertType.Success)
                            setUsersListUpdate(true)
                        })
                }
            })
    }

    const handleUserLevelChange = (event: React.ChangeEvent<{name?: string | undefined; value: unknown;}>, child: React.ReactNode) => {
        setUserLevel(event.target.value as UserLevel)
    }

    const handleUserDelete = (id: string|undefined) => {
        if (id) {
            deleteUserById(id)
                .then(() => {
                    setUsersListUpdate(true)
                })
        }
    }

    const Alert = (props: AlertProps) => {
        return <MuiAlert elevation={3} variant="filled" className="primary" {...props} />;
    }

    const snackBarOnClose = (event?: React.SyntheticEvent, reason?: string) => {
        setMessageType(AlertType.None);
    };

    const showAdmin = (): JSX.Element => {
        if (user && ['admin'].includes(user.user_level)) {
            return (
                <div className="row pt-5">
                    <div className="col-md-5 px-lg-5 pl-md-5 pb-5">
                        <form className="col-12 col-md-11 pl-0 " onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <TextField id="admin-id" className="w-100" {...register("employeeId", { required: true })} label="Employee's ID" placeholder="Type employee's id" helperText="Field is required."  />
                            </div>
                            <div className="mt-4">
                                <TextField id="admin-name" className="w-100" {...register("employeeName", { required: true })} label="Employee's name" placeholder="Type employee's name" helperText="Field is required." />
                            </div>
                            <div className="mt-4">
                                <TextField id="admin-password" className="w-100" {...register("employeePassword", { required: true })} label="Employee's password" placeholder="Type employee's password" helperText="Field is required." />
                            </div>
                            <div className="mt-4">
                                <FormControl className='select-form-control w-100'>
                                    <InputLabel id="admin-label-select">Employee's user level</InputLabel>
                                    <Select
                                            id="admin-select"
                                            className="w-100"
                                            labelId="admin-label-select"
                                            {...register("employeeUserLevel", { required: true })}
                                            value={userLevel}
                                            onChange={handleUserLevelChange}
                                        >
                                        <MenuItem value={'employee'}>Employee</MenuItem>
                                        <MenuItem value={'admin'}>Admin</MenuItem>
                                    </Select>
                                    <FormHelperText>Field is required.</FormHelperText>
                                </FormControl>
                            </div>
                            <div className="mt-5">
                                <Button type='submit' color='primary' >Save user</Button>
                            </div>
                        </form>
                        <Snackbar open={messageType === AlertType.Success} autoHideDuration={6000} onClose={snackBarOnClose}>
                            <Alert onClose={snackBarOnClose} severity="success">
                                User saved!
                            </Alert>
                        </Snackbar>
                        <Snackbar open={messageType === AlertType.Error} autoHideDuration={6000} onClose={snackBarOnClose}>
                            <Alert onClose={snackBarOnClose} severity="error">
                                Server error.
                            </Alert>
                        </Snackbar>
                        <Snackbar open={messageType === AlertType.Warning} autoHideDuration={6000} onClose={snackBarOnClose}>
                            <Alert onClose={snackBarOnClose} severity="warning">
                                {message}
                            </Alert>
                        </Snackbar>
                    </div>
                    <div className="users col-md-7 pr-md-5">
                        {usersList}
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
            {showAdmin()}
        </>
    );
}
 
export default TimeClockAdmin;