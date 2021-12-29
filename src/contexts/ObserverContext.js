import React, { createContext, useEffect, useState } from 'react';
import { logv } from '../dev/log';

export const ObserverContext = createContext({});

function serialize(conditions) {
    return conditions.operation + '_' + conditions.entityName;
}

const setMethodNames = {add: 'add', delete: 'delete'};

/*************** USAGE *******************
// example as to be used in EditEntity
const commandListExample = [
    {
        conditions: {operation: 'edit', entityName: entityName},
        handler: () => {
            setItem(item);
            useFormFunctions.reset();
        }
    },
];
// example as to be used in SummaryListTall
const commandListExample = [
    {
        conditions: {operation: 'put', entityName: entityName},
        handler: (formData) => {
            const id = formData.id;
            const index = list.findIndex(item => item.id === id);
            const newList = [...list.slice(0, index), formData, ...list.slice(index + 1)];
            updateList(newList, id);
        }
    },
];
********************************************/

export function ObserverContextProvider({children}) {
    const logRoot = ObserverContextProvider.name;
    const [subscriptions, setSubscriptions] = useState(new Set());

    function changeSubscriptions(commandList, methodName) {
        const logPath = `${logRoot} » ${changeSubscriptions.name}(⬇, ${methodName}`;
        // logv(logPath, {commandList});
        setSubscriptions(currentSubscriptions => {
            const newSubscriptions = {...currentSubscriptions};
            commandList.forEach(command => {
                const {conditions, handler} = command;
                const key = serialize(conditions);
                const handlerList = new Set(currentSubscriptions?.[key]);
                handlerList[methodName](handler);// add() or delete()
                newSubscriptions[key] = handlerList;
            });
            return newSubscriptions;
        });
    }

    function subscribe(commandList) {
        changeSubscriptions(commandList, setMethodNames.add);
    }

    function unsubscribe(commandList) {
        changeSubscriptions(commandList, setMethodNames.delete);
    }

    function getHandlers(conditions) {
        const key = serialize(conditions);
        return subscriptions[key];
    }

    function hasHandler(conditions) {
        return getHandlers(conditions)?.size > 0;
    }

    function raise(conditions, ...args) {
        const logPath = `${logRoot} » ${raise.name}(⬇, ⬇)`;
        // logv(logPath, {conditions, args});
        const relevantHandlers = getHandlers(conditions);
        // logv(null, {subscriptions, relevantHandlers});
        relevantHandlers.forEach(handler => handler(...args));
    }

    function useObserver(commandList) {
        useEffect(() => {
            subscribe(commandList);
            return () => {
                unsubscribe(commandList)
            }    
        }, [commandList]);
    }
    
    return(
        <ObserverContext.Provider value={{useObserver, raise, hasHandler}} >
            {children}
        </ObserverContext.Provider>
    );
}
