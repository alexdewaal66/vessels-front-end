import { useState } from 'react';
import { logCondition, logv } from './log';

export function useLoggingState(initialState, stateName, logRoot, entityName) {
    const [state, setState] = useState(initialState);
    const logPath = `${logRoot} » set${stateName}()`;
    const doLog = logCondition(useLoggingState, entityName);

    function setStateAndLog(update) {
        if (typeof update === 'function') {
            setState(oldState => {
                const newState = update(oldState);
                if (doLog) logv(logPath, {oldState, newState}, '🔎🔁 ');
                return newState;
            })
        } else {
            if (doLog) logv(logPath, {state, update}, '🔎 ');
            setState(update);
        }
    }

    return [state, setStateAndLog];
}
