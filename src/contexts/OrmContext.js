import React, { createContext } from 'react';
import { useStorage } from '../helpers/useStorage';

// O.R.M. = Object Rest Mapping 😏
export const OrmContext = createContext({});

const actionTypes = {
    readIds: 'readIds', readAll: 'readAll', readByExample: 'readByExample',
    read: 'read', create: 'create', update: 'update', delete: 'delete',
};

export function OrmContextProvider({children}) {
    const storage = useStorage();

    return (
        <OrmContext.Provider value={{storage, actionTypes}}>
                {children}
        </OrmContext.Provider>
    )
}

