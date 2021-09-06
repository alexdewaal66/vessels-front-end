import React, { createContext, useEffect, useState } from 'react';

export const CommandContext = createContext({});

export const operationNames =  {
    edit: 'edit',
    put: 'put',
    post: 'post',
    delete: 'delete',
}

//todo: rewrite using useReducer ??
export function CommandContextProvider({children}) {
    const [command, setCommand] = useState(
        {operation: null, data: null, entityType: null, receiver: null}
    );


    return (
        <CommandContext.Provider value={[command, setCommand]}>
            {children}
        </CommandContext.Provider>
    )
}

export function useCommand(conditions, command) {
    function executeRelevantCommand() {
        // console.log(`👀 conditions=`, conditions, `command=`, command);
        if (command.operation in conditions.operations &&
        command.entityType === conditions.entityType &&
        command.receiver === conditions.receiver) {
            conditions.operations[command.operation](command.data);
        }
    }

    useEffect(executeRelevantCommand, [command]);
}