import React, { createContext, useReducer, useState } from 'react';
import { remote } from './ormHelpers';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { useRequestState } from '../helpers/customHooks';

// O.R.M. = Object Rest Mapping
export const OrmContext = createContext({});

const actionTypes = {
    readIds: 'readIds', readAll: 'readAll', readByExample: 'readByExample',
    read: 'read', create: 'create', update: 'update', delete: 'delete',
};

function reducer(state, action) {
    switch (action.type) {
        case actionTypes.read:
            return state;
        case actionTypes.create:
            return state;
        default:
            return state;
    }
}

function initialStorage() {
    const storage = {};
    Object.entries(entitiesMetadata).forEach(([entityName, metadata]) => {
        storage[entityName] = {};
        const entityStore = storage[entityName];
        entityStore.readIdsRequestState = useRequestState();// prob not allowed
        remote.readIds(
            metadata,
            entityStore.readIdsRequestState,
            (response) => entityStore.ids = response.data,
            // () =>
            );
    });
    return storage;
}

export function OrmContextProvider({children}) {
    const [storage, dispatch] = useReducer(reducer, {}, initialStorage);


    return (
        <OrmContext.Provider value={{storage, dispatch, actionTypes}}>
            <>
                {children}
            </>
        </OrmContext.Provider>
    )
}

