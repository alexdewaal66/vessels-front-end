import React from 'react';
import layout from './pageLayout.module.css';
import { cx } from '../helpers';
import { ShowStatus } from './ShowStatus';

export function Footer({children, className, ...rest}) {
    return (
        <aside className={cx(layout.footer, className)} {...rest}>
            {children}
            <ShowStatus />
        </aside>
    );
}