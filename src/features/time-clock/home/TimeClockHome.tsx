import React, { Context, useContext, useEffect } from "react";
import { useState } from "react";
import { User } from "../../../models/Users";
import { getUser } from "../../../services/Users";
import { StoreContext } from "../../../store/Store";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useForm } from "react-hook-form";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { Snackbar } from "@material-ui/core";

enum AlertType {
    Success,
    Warning,
    Info,
    Error,
    None
}

export interface TimeClockHomeProps {}
 
const TimeClockHome: React.FunctionComponent<TimeClockHomeProps> = () => {
    
    const {register, handleSubmit, formState} = useForm()
    const [, setUser] = useContext(StoreContext as Context<[User,Function]>)
    const [message, setMessage] = useState(AlertType.None);
    
    useEffect(() => {
        if (Object.keys(formState.errors).length && formState.isSubmitted) {
            setMessage(AlertType.Warning)
            formState.errors = {}
        }
    }, [formState]);

    const onSubmit = ({employeeId, employeePassword}: {employeeId: string, employeePassword: string}) => {
        getUser(employeeId)
            .then((data: User[]) => {
                if (!data) {
                    setUser(null)
                    return
                }
                if (data && data.length && employeePassword === data[0].password) {
                    setUser(data[0])
                    setMessage(AlertType.Success)
                } else {
                    setUser(null)
                    setMessage(AlertType.Error)
                }
            })
    }

    const Alert = (props: AlertProps) => {
        return <MuiAlert elevation={3} variant="filled" className="primary" {...props} />;
    }

    const snackBarOnClose = (event?: React.SyntheticEvent, reason?: string) => {
        setMessage(AlertType.None);
    };

    return (  
        <>
        <div className="row pt-5">
            <div className="col-md-5 px-lg-5 pl-md-5 pb-5">
                <form className="col-12 col-md-11 pl-0 " onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <TextField className="w-100" {...register("employeeId", { required: true })} label="Employee's ID" placeholder="Type your employee id" helperText="Field is required."  />
                    </div>
                    <div className="mt-4">
                        <TextField className="w-100" {...register("employeePassword", { required: true })} label="Employee's password" placeholder="Type your employee password" helperText="Field is required." />
                    </div>
                    <div className="mt-5">
                        <Button type='submit' color='primary' >Sign in</Button>
                    </div>
                </form>
                <Snackbar open={message === AlertType.Success} autoHideDuration={6000} onClose={snackBarOnClose}>
                    <Alert onClose={snackBarOnClose} severity="success">
                        User found! You have access to the site.
                    </Alert>
                </Snackbar>
                <Snackbar open={message === AlertType.Error} autoHideDuration={6000} onClose={snackBarOnClose}>
                    <Alert onClose={snackBarOnClose} severity="error">
                        User not found!
                    </Alert>
                </Snackbar>
                <Snackbar open={message === AlertType.Warning} autoHideDuration={6000} onClose={snackBarOnClose}>
                    <Alert onClose={snackBarOnClose} severity="warning">
                        All fields are required.
                    </Alert>
                </Snackbar>
            </div>
            <div className="welcome col-md-7 pr-md-5">
                <p>Welcome!</p>
                <p>The Time Clock is here to help you keep your working time organized.</p>
                <p>Click on "CLOCK" to punch in/out or check your timesheet and working hours.</p>
                <p>The button 
                    <span className="help-icon">
                        <img className="help-icon-img" src={process.env.PUBLIC_URL + '/assets/help-icon.png'} alt='Help icon' />
                    </span>
                 is up there to help you. Click on the icon any time to found out more about this app.</p>
            </div>
        </div>
        </>
    );
}
 
export default TimeClockHome;