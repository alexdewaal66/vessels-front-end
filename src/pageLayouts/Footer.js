import React from 'react';
import layout from './pageLayout.module.css';
import { config, cx } from '../helpers';
import { ShowStatus } from './ShowStatus';

export function Footer({children, className, setTrigger, ...rest}) {

    const changeHandler = (key) => () => {
        config[key].value = !config[key].value;
        setTrigger(x => !x);
    };

    return (
        <aside className={cx(layout.footer, className)} {...rest}
        >
            <span>
                {Object.keys(config).map(key =>
                    <label key={'config.' + key}>
                        <input type="checkbox"
                               checked={config[key].value}
                               onChange={changeHandler(key)}
                        />
                        {config[key].label}
                    </label>
                )}
            </span>
            <table className={layout.credentials}>
                <tbody>
                <tr>
                    <td>gewoonlid</td>
                    <td>deskundige</td>
                    <td>beheerder</td>
                </tr>
                <tr>
                    <td>IkMagBeperkt</td>
                    <td>IkMagVeel</td>
                    <td>IkMagAlles</td>
                </tr>
                </tbody>
            </table>
            <a href="https://github.com/alexdewaal66/vessels-front-end" className={layout.link}>
                GitHub - Front End
            </a>
            <a href="https://github.com/alexdewaal66/vessels-back-end" className={layout.link}>
                GitHub - Back End
            </a>
            <ShowStatus/>
        </aside>
    );
}
