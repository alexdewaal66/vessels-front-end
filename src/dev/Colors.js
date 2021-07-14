import React from 'react';
import colorStyles from './colors.module.css';


export function Colors() {
    const colorClasses = [
        'main-color-darker',   'main-color-normal',   'main-color-light',
        'input-color-darker',  'input-color-normal',  'input-color-light',
        'alt1-color-darker',   'alt1-color-normal',   'alt1-color-light',
        'alt2-color-darker',   'alt2-color-normal',   'alt2-color-light',
        'compl-color-darker',  'compl-color-normal',  'compl-color-light'
    ];

    return (
        <div className={colorStyles.container}>
            {colorClasses.map((className) => (
                    <p className={colorStyles[className]} key={className}>{className}</p>
                )
            )}
        </div>
    );
}
