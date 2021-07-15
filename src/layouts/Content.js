import React from 'react';
import layout from './layout.module.css';

export function Content({children}) {
    return (
        <div className={layout.container}>
            {children}
        </div>
    );
}