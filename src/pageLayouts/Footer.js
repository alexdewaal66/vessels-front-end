import React from 'react';
import layout from './pageLayout.module.css';
import {  cx, hints, text, languageSelector } from '../helpers';
import { sessionConfig } from '../helpers/globals/sessionConfig';
import { ShowStatus } from './ShowStatus';
import zipFile from '../assets/images.zip';

const messages = {
    NL: {
        zip: 'Zip-bestand met afbeeldingen',
    },
    EN: {
        zip: 'Zip file with images',
    },
};

export function Footer({children, className, forceUpdate, ...rest}) {

    const TXT = messages[languageSelector()];

    const changeHandler = (key) => () => {
        sessionConfig[key].value = !sessionConfig[key].value;
        forceUpdate();
    };

    return (
        <aside className={cx(layout.footer, className)} {...rest}
        >
            <span style={{height: '100%'}} >
                {Object.keys(sessionConfig).map(key =>
                    <label key={'sessionConfig.' + key}
                           title={hints(sessionConfig[key].hint)}
                           style={{display: 'inline-block', height: '100%'}}
                    >
                        <input type="checkbox"
                               checked={sessionConfig[key].value}
                               onChange={changeHandler(key)}
                        />
                        {text(sessionConfig[key].label)}
                    </label>
                )}
            </span>
            <table>
                <tbody>
                <tr>
                    <td className={layout.credentials} title={hints('MEMBER')}>gewoonlid</td>
                    <td className={layout.credentials} title={hints('EXPERT')}>deskundige</td>
                    <td className={layout.credentials} title={hints('ADMIN')}>beheerder</td>
                </tr>
                <tr>
                    <td className={layout.credentials} title={hints('MEMBER')}>IkMagBeperkt</td>
                    <td className={layout.credentials} title={hints('EXPERT')}>IkMagVeel</td>
                    <td className={layout.credentials} title={hints('ADMIN')}>IkMagAlles</td>
                </tr>
                </tbody>
            </table>
            <a href="https://github.com/alexdewaal66/vessels-front-end" className={layout.link}>
                GitHub - Front End
            </a>
            <a href="https://github.com/alexdewaal66/vessels-back-end" className={layout.link}>
                GitHub - Back End
            </a>
            <a href={zipFile} className={layout.link}>{TXT.zip}</a>
            <ShowStatus/>
        </aside>
    );
}
