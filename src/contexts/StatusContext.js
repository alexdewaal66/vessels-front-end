import React, { createContext, useState } from 'react';

export const StatusContext = createContext({});

export function StatusContextProvider({children}) {
    const [statusMessage, setStatusMessage] = useState('');

    return (
        <StatusContext.Provider value={{statusMessage, setStatusMessage}}>
                {children}
        </StatusContext.Provider>
    )
}