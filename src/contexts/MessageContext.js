import React, { createContext, useCallback, useState } from 'react';

export const MessageContext = createContext({});

export function MessageContextProvider({children}) {
    const [statusMessage, setStatusMessage] = useState('');

    const updateStatusMessage = useCallback((message) => {
            if (message !== statusMessage)
                setStatusMessage(message);
        }
        , [statusMessage]);


    return (
        <MessageContext.Provider value={{
            statusMessage, updateStatusMessage
        }}>
            {children}
        </MessageContext.Provider>
    )
}