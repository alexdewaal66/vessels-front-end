import React from 'react';
import layout from './pageLayout.module.css';

export function Footer({children, ...rest}) {
    return (
        <aside className={layout.footer} {...rest}>
            {children}
        </aside>
    );
}