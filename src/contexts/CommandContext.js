import React, { createContext, useEffect, useState } from 'react';
import { logv } from '../dev/log';
import { useConditionalEffect } from '../helpers';

export const CommandContext = createContext({});

export const operationNames =  {
    edit: 'edit',
    put: 'put',
    post: 'post',
    delete: 'delete',
    search: 'search',
}

//todo: rewrite using useReducer ??
export function CommandContextProvider({children}) {
    const [command, setCommandState] = useState(
        {operation: null, data: null, entityType: null, receiver: null, ready: true}
    );

    function setCommand(arg) {
        const logPath = `${CommandContextProvider.name} » ${setCommand.name}(⬇)`;
        logv(logPath, {command, ...arg});
        setCommandState(arg);
    }

    return (
        <CommandContext.Provider value={[command, setCommand]}>
            {children}
        </CommandContext.Provider>
    )
}

export function useCommand(conditions, command) {
    function executeRelevantCommand() {
        const logPath = `${useCommand.name}(⬇, ⬇) » ${executeRelevantCommand.name}()`;
        logv(logPath, {conditions, command});
        if (command.operation in conditions.operations &&
        command.entityType === conditions.entityType &&
        command.receiver === conditions.receiver) {
            logv(null, {conditions, command});
            conditions.operations[command.operation](command.data);
        }
    }

    useConditionalEffect(executeRelevantCommand, command.ready,[command]);
}