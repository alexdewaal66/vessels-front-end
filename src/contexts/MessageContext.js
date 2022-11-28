import React, { createContext, useState } from 'react';

export const MessageContext = createContext({});

export function MessageContextProvider({children}) {
    const [statusMessage, setStatusMessage] = useState('');

    return (
        <MessageContext.Provider value={{
            statusMessage, setStatusMessage
        }}>
            {children}
        </MessageContext.Provider>
    )
}