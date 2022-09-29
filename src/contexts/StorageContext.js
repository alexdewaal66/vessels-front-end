import React, { createContext } from 'react';
import { useStorage } from '../helpers/useStorage';
import { ShowRequestState } from '../components';

export const StorageContext = createContext({});

export function StorageContextProvider({children}) {
    const storage = useStorage();
    const {rsStatus} = storage;

    return (
        <StorageContext.Provider value={storage}>
            <ShowRequestState {...rsStatus} />
                {children}
        </StorageContext.Provider>
    )
}

