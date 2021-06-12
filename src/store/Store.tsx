import React, { createContext, Dispatch, SetStateAction, useState } from "react";
import { User } from "../models/Users";

export interface IStoreContext {
    user?: User,
    setUser?: React.Dispatch<React.SetStateAction<User|null>>,
}

const initialState: IStoreContext = {
    user: {
        id: '',
        employee_id: '',
        name: '',
        since: '',
        password: '',
        user_level: ''
    }
};

export const StoreContext = createContext<IStoreContext | Dispatch<SetStateAction<IStoreContext>> | unknown>(initialState)

export const StoreProvider = (props: { children: React.ReactChild | React.ReactFragment | React.ReactPortal }): JSX.Element => {
    const [user, setUser] = useState(initialState)
    return (
        <StoreContext.Provider value={[user, setUser]}>
            {props.children}
        </StoreContext.Provider>
    )
};
