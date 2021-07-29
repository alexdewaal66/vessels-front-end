import React from 'react';
import layout from './pageLayout.module.css';
import { cx } from '../helpers/multipleStyles';

export function Statusbar({children, className, ...rest}) {
    return (
        <aside className={cx(layout.statusbar, className)} {...rest}>
            {children}
        </aside>
    );
}