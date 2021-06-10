import React, { createContext, useState } from "react";
import { User } from "../models/Users";

interface IStoreContext {
    user?: User,
    setUser?: React.Dispatch<React.SetStateAction<User|null>>
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

export const StoreContext = createContext<IStoreContext| React.ReactChild | React.ReactFragment | React.ReactPortal>(initialState)

export const StoreProvider = (props: { children: React.ReactChild | React.ReactFragment | React.ReactPortal }): JSX.Element => {
    const [user, setUser] = useState(initialState)
    return (
        <StoreContext.Provider value={[user, setUser]}>
            {props.children}
        </StoreContext.Provider>
    )
};
