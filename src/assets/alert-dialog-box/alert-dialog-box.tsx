import React, { ReactElement, Ref } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions'

export interface IAlertDialogBoxProps {
    state: [
        open: boolean,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
    ],
    children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
}

const Transition = React.forwardRef(function Transition(
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    props: TransitionProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogBox = ({ state: [open, setOpen], children }: IAlertDialogBoxProps ): JSX.Element => {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                >
                <DialogTitle id="alert-dialog-slide-title">{"Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {children}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AlertDialogBox