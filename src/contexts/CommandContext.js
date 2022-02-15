import React, { createContext, useState } from 'react';
import { useConditionalEffect } from '../helpers';

export const CommandContext = createContext({});

export const operationNames = {
    edit: 'edit',
    put: 'put',
    post: 'post',
    delete: 'delete',
    search: 'search',
}
const initialCommand = {operation: null, data: null, entityType: null, receiver: null, idle: true};

//todo: rewrite using useReducer ??
export function CommandContextProvider({children}) {
    // const logRoot = rootMkr(CommandContextProvider);
    const [command, setCommandState] = useState(initialCommand);

    function setCommand(newCommand) {
        // const logPath = pathMkr(logRoot, setCommand, '↓');
        // logv(logPath, {currentCommand:command, newCommand});
        // setCommandState(newCommand);
        setCommandState(current =>
            (current.idle)
                ? {...newCommand, idle: false}
                : current
        );
    }

    function useCommand(conditions) {
        function executeRelevantCommand() {
            // const logPath = pathMkr(logRoot, `${useCommand.name}(⬇) » ${executeRelevantCommand.name}()`;
            // const logPath = pathMkr(logRoot, [useCommand, executeRelevantCommand], ['↓']);
            const match =
                command.operation  in  conditions.operations &&
                command.entityType === conditions.entityType &&
                command.receiver   === conditions.receiver;
            // logv(logPath, {conditions, command, match});
            if (match) {
                // logv(null, {conditions, command});
                conditions.operations[command.operation](command.data);
                setCommandState(initialCommand);
            }
        }

        useConditionalEffect(executeRelevantCommand,
            !command.idle,
            [command]);
    }


    return (
        <CommandContext.Provider value={{useCommand, setCommand}}>
            {children}
        </CommandContext.Provider>
    )
}

