import { useRef } from 'react';
// import { logv, pathMkr, rootMkr } from '../dev/log';
// const logRoot = 'useStaticObject.js';

const dummyTarget = {};

function handler(container) {
    // const logPath = pathMkr(logRoot, handler);
    return {
        get: (target, propName) => {
            if (propName === 'null') return container.current;
            return  container.current[propName];
        },

        set: (target, propName, value) => {
            // logv(logPath, {container, propName, value}, 'setter');
            container.current[propName] = value;
            return true;
        },

        deleteProperty: (target, prop) => {
            if (prop in container.current) delete container.current[prop];
        }
    };
}

export function useStaticObject(initialValue = {}) {
    const container = useRef(initialValue);
    return new Proxy(dummyTarget, handler(container));
}

