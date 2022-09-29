import { useRef } from 'react';
import { logConditionally, logv, pathMkr } from './log';

export function useCounter(logRoot, label = '', limit) {
    const counter = useRef(0);

    const logPath = `${logRoot} » renderCount[${label}] = `;
    const doLog = logConditionally(label);

    counter.current++;
    if (doLog) logv(logPath + counter.current);

    return ({value: counter.current, passed: counter.current >= limit});
}