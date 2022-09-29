import React from 'react';
import layout from './pageLayout.module.css';
import { sessionConfig, cx, hints } from '../helpers';
import { ShowStatus } from './ShowStatus';

export function Footer({children, className, forceUpdate, ...rest}) {

    const changeHandler = (key) => () => {
        sessionConfig[key].value = !sessionConfig[key].value;
        forceUpdate();
    };

    return (
        <aside className={cx(layout.footer, className)} {...rest}
        >
            <span>
                {Object.keys(sessionConfig).map(key =>
                    <label key={'sessionConfig.' + key}
                           title={hints(sessionConfig[key].hint)}
                    >
                        <input type="checkbox"
                               checked={sessionConfig[key].value}
                               onChange={changeHandler(key)}
                        />
                        {sessionConfig[key].label}
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
            {/*<span className={layout.button}>*/}
            {/*    <button onClick={forceUpdate}>Render</button>*/}
            {/*</span>*/}
            <ShowStatus/>
        </aside>
    );
}
