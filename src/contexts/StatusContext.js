import React, { createContext, useState } from 'react';

export const StatusContext = createContext({});

export function StatusContextProvider({children}) {
    const [statusMessage, setStatusMessage] = useState('');

    // const [rsStatus, setRsStatus] = useState({
    //     requestState: null,
    //     description: '-nog geen beschrijving-',
    //     advice: '-nog geen advies-'
    // });


    return (
        // <StatusContext.Provider value={{statusMessage, setStatusMessage, rsStatus, setRsStatus}}>
        <StatusContext.Provider value={{statusMessage, setStatusMessage}}>
                {children}
        </StatusContext.Provider>
    )
}