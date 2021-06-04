import React, { ContextType, createContext, useState } from "react";
import { User } from "../models/Users";

const initialState: User = {
    id: '',
    employee_id: '',
    name: '',
    since: '',
    password: '',
    user_level: ''
};

export const StoreContext = createContext<ContextType<any>|User>(initialState)

export const StoreProvider = (props: { children: React.ReactChild | React.ReactFragment | React.ReactPortal }) => {
    const [user, setUser] = useState(initialState)
    return (
        <StoreContext.Provider value={[user, setUser]}>
            {props.children}
        </StoreContext.Provider>
    )
};
