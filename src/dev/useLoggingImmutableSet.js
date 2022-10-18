import { useImmutableSet } from '../helpers';
import { logCondition, logv } from './log';

export function useLoggingImmutableSet(initialState, setName, logRoot, entityName) {
    const immutableSet = useImmutableSet(initialState);
    const logPath = `${logRoot} » ImmutableSet: ${setName}`;
    const doLog = logCondition(useLoggingImmutableSet, entityName);

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