import React from 'react';
import layout from './layout.module.css';

export function Command({children, ...rest}) {
    return (
        <main className={layout.command} {...rest}>
            {children}
        </main>
    );
}