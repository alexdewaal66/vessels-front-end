import React from 'react';
import layout from './pageLayout.module.css';

export function Statusbar({children, ...rest}) {
    return (
        <aside className={layout.statusbar} {...rest}>
            {children}
        </aside>
    );
}