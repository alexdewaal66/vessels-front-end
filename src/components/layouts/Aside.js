import React from 'react';
import layout from '../../layout.module.css';

export function Aside({children}) {
    return (
        <aside className={layout.aside}>
            {children}
        </aside>
    );
}