import React, { createContext, useState } from 'react';
import { useRequestState, useMountEffect } from '../helpers/customHooks';
import { Statusbar } from '../pageLayouts/Statusbar';
import { AuthContext } from './AuthContext';


export const EntityContext = createContext({});


export function EntityContextProvider({children}) {
    const entityRequestState = useRequestState();
    const entityData = {};

    //todo: functions for:
    //      - retrieving a particular X
    //      - retrieving X list
    //      - updating X list
    //      - summarize X
    //      - ...

    return (
        <EntityContext.Provider value={entityData}>
            <>
                {entityRequestState.isIdle && (
                    <Statusbar>request nog niet gestart</Statusbar>
                )}
                {entityRequestState.isPending
                    ? <Statusbar>request is bezig</Statusbar>
                    : children
                }
                {entityRequestState.isError && (
                    <Statusbar>request mislukt, ({entityRequestState.errorMsg})</Statusbar>
                )}
                {entityRequestState.isSuccess && (
                    <Statusbar>request geslaagd</Statusbar>
                )}
            </>
        </EntityContext.Provider>
    )
}