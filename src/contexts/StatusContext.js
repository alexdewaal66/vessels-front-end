import React, { createContext, useCallback, useState } from 'react';

export const StatusContext = createContext({});

export function StatusContextProvider({children}) {
    const [statusMessage, setStatusMessage] = useState('');

    function updateStatusMessage(message) {
        if (message !== statusMessage) setStatusMessage(message);
    }
    // const updateStatusMessage = useCallback(    (message) =>
    //     {
    //         if (message !== statusMessage) setStatusMessage(message);
    //     }
    // , [statusMessage]);

    return (
        <StatusContext.Provider value={{statusMessage, updateStatusMessage}}>
            {children}
        </StatusContext.Provider>
    )
}