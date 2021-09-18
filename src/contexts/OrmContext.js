import React, { createContext } from 'react';
import { useStorage } from '../helpers/useStorage';
import { ShowRequestState } from '../components';

// O.R.M. = Object Rest Mapping 😏
export const OrmContext = createContext({});

export function OrmContextProvider({children}) {
    const storage= useStorage();
    const {rsStatus} = storage;

    return (
        <OrmContext.Provider value={storage}>
            <ShowRequestState {...rsStatus} />
                {children}
        </OrmContext.Provider>
    )
}

