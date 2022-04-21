import React from 'react';
import { useStaticObject } from './useStaticObject';
import { ShowObject } from '../ShowObject';
import { useState } from 'react';
import { logv, pathMkr, rootMkr } from '../log';

export function TestUseStaticObject() {
    const logRoot = rootMkr(TestUseStaticObject);
    const [x, setX] = useState(0);
    const [count, setCount] = useState(0);
    const dict = useStaticObject({
        zomaarwaat: 'zomaarwaat',
        bcc: 0,
        renderCount: 0
    });
    dict.zomaarwaat = 'tekst toegekend aan dict.zomaarwaat';
    dict.renderCount += 1;
    dict.x= {y: 'x_y'};
    dict.x.z = 'x_z';
    const {y} = dict.x;


    function bcc() {
        const logPath = pathMkr(logRoot, bcc);
        dict.bcc += 1;
        if (dict.bcc % 10 === 0) {
            setX({...dict[null]});// must be new object to be considered state change
            logv(logPath, {container: dict[null], y});
        }
    }

    function showCount() {
        setCount(dict.bcc);
    }

    return (
        <>
            <ShowObject data={x}>dict</ShowObject><br/>
            count:{count}<br/>
            x.bcc:{x.bcc}<br/>
            <button onClick={bcc}>Count</button>
            <button onClick={showCount}>Show count</button>
        </>
    );
}

