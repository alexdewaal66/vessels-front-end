import React, { createContext, useEffect, useState } from 'react';

export const CommandContext = createContext({});

export const operationNames =  {
    edit: 'edit',
    put: 'put',
    post: 'post',
    delete: 'delete',
}


export function CommandContextProvider({children}) {
    const [command, setCommand] = useState(
        {operation: null, data: null, entityType: null}
    );


    return (
        <CommandContext.Provider value={{command, setCommand}}>
            {children}
        </CommandContext.Provider>
    )
}

export function useCommand(operations, command) {
    function executeCommand() {
        if (command.operation in operations) {
            operations[command.operation](command.data, command.entityType);
        }
    }

    useEffect(executeCommand, [command]);
}