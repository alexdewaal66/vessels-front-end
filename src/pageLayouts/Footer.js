import React, { useState } from 'react';
import layout from './pageLayout.module.css';
import { config, cx, hints } from '../helpers';
import { ShowStatus } from './ShowStatus';

export function Footer({children, className, setTrigger, ...rest}) {

    const clickHandler = (key) => () => {
        config[key].value = !config[key].value;
        setTrigger(x => !x);
    };

    return (
        <aside className={cx(layout.footer, className)} {...rest}>
            <span>
                {Object.keys(config).map(key =>
                    <label>
                        <input type="checkbox"
                               checked={config[key].value}
                               onClick={clickHandler(key)}
                        />
                        {config[key].label}
                    </label>
                )}
            </span>
            <span title={hints('natuurlijk is dit onveilig! 😏')}>
                <span className={layout.credentials}>
                    gewoonlid — IkMagBeperkt
                </span>
                <span className={layout.credentials}>
                deskundige — IkMagVeel
                </span>
                <span className={layout.credentials}>
                    beheerder — IkMagAlles
                </span>
            </span>
            <ShowStatus/>
        </aside>
    );
}
