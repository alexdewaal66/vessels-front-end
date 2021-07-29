import React from 'react';
import layout from './pageLayout.module.css';
import { cx } from '../helpers/multipleStyles';

export function Aside({children, className, ...rest}) {
    return (
        <aside className={cx(layout.aside, className)} {...rest}>
            {children}
        </aside>
    );
}