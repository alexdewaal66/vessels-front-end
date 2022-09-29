import { useImmutableSet } from '../helpers';
import { logConditionally, logv } from './log';

export function useLoggingImmutableSet(initialState, setName, logRoot, entityName) {
    const immutableSet = useImmutableSet(initialState);
    const logPath = `${logRoot} » ImmutableSet: ${setName}`;
    const doLog = logConditionally(entityName);

    const handler = {
        get(target, propName) {
            const originalProp = target[propName];
            if (typeof originalProp === 'function' && doLog) {
                if (propName === 'has') return originalProp;
                return (arg) => {
                    const result = originalProp(arg);
                    logv(logPath, {propName, arg, result}, '🔎 ');
                    return result;
                }
            } else {
                return originalProp;
            }
        },
    };

    return new Proxy(immutableSet, handler);
}