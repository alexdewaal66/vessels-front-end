import { useEffect, useRef } from 'react';
import { logv, pathMkr } from './log';

function usePrevious(value, initialValue) {
    const ref = useRef(initialValue);

    useEffect(() => {
        ref.current = value;
        // console.log(ref.current);
    });

    return ref.current;
}

export function useLoggingEffect(callback, dependencies, dependencyNames = []) {
    const logPath = pathMkr('🔄', useLoggingEffect);
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency
                }
            };
        }

        return accum;
    }, {});

    if (Object.keys(changedDeps).length) {
        logv(logPath, changedDeps, '👀➖👀 ');
    }

    useEffect(callback, [callback, ...dependencies]);
}

export function useLoggingConditionalEffect(condition, callback, dependencies, dependencyNames) {
    useLoggingEffect(() => {
            if (condition)
                callback();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dependencies, dependencyNames
    );
}

