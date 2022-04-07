import { useRef } from 'react';
// import { logv, pathMkr, rootMkr } from '../dev';
// const logRoot = 'useStatic.js';

const dummyTarget = {};

function handler(container) {
    // const logPath = pathMkr(logRoot, handler);
    return {
        get: (target, prop) => {
            if (prop === 'null') return container.current;
            return  container.current[prop];
        },

        set: (target, prop, value) => {
            // logv(logPath, {container, prop, value}, 'setter');
            container.current[prop] = value;
            return true;
        },

        deleteProperty: (target, prop) => {
            if (prop in container.current) delete container.current[prop];
        }
    };
}

export function useStatic(initialValue = {}) {
    const container = useRef(initialValue);
    return new Proxy(dummyTarget, handler(container));
}

