import React, { createContext, useCallback, useState } from 'react';

export const StatusContext = createContext({});

const separator = ' - ';

export function StatusContextProvider({children}) {
    const [statusMessage, setStatusMessage] = useState('');

    // function updateStatusMessage(message) {
    //     setStatusMessage(oldMessage => {
    //         const [oldText, oldCount] = oldMessage.split(separator);
    //         if (message !== oldText) {
    //             return (message + separator + 1);
    //         } else {
    //             const count = +(oldCount ?? 0) + 1
    //             return (message + separator + count);
    //         }
    //     });
    // }

    const updateStatusMessage = useCallback((message) => {
            if (message !== statusMessage)
                setStatusMessage( message);
        }
        , [statusMessage]);

    return (
        <StatusContext.Provider value={{statusMessage, updateStatusMessage}}>
            {children}
        </StatusContext.Provider>
    )
}