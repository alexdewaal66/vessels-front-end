import React from 'react';
import layout from './layout.module.css';

export function Aside({children, ...rest}) {
    return (
        <aside className={layout.aside} {...rest}>
            {children}
        </aside>
    );
}