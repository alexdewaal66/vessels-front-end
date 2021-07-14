import React from 'react';
import layout from './layout.module.css';

export function Command({children}) {
    return (
        <main className={layout.command}>
            {children}
        </main>
    );
}