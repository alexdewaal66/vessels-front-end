import React from 'react';
import layout from './pageLayout.module.css';

export function Content({children}) {
    return (
        <div className={layout.content}>
            {children}
        </div>
    );
}