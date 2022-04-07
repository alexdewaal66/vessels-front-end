import React from 'react';
import { useStatic } from '../helpers/useStatic';
import { ShowObject } from './ShowObject';
import { useState } from 'react';
import { logv, pathMkr, rootMkr } from './log';

export function TestUseStatic() {
    const logRoot = rootMkr(TestUseStatic);
    const [x, setX] = useState(0);
    const dict = useStatic({
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
        if (dict.bcc % 10 === 0) setX(dict[null]);
        logv(logPath, {container: dict[null], y});
    }


    return (
        <>
            <ShowObject data={x}>dict</ShowObject>
            {/*x={x}*/}
            <button onClick={bcc}>Count</button>
        </>
    );
}

