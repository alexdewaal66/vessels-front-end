import React from 'react';
import layout from './pageLayout.module.css';
import { cx } from '../helpers';

export function Content({children, className, ...rest}) {
    return (
        <div className={cx(layout.content, className)} {...rest}>
            {children}
        </div>
    );
}