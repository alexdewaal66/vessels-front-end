import React, { createContext, useContext } from 'react';
import { useStorage } from '../helpers/useStorage';

// O.R.M. = Object Rest Mapping 😏
export const OrmContext = createContext({});

export function OrmContextProvider({children}) {
    const storage = useStorage();

    return (
        <OrmContext.Provider value={storage}>
                {children}
        </OrmContext.Provider>
    )
}

