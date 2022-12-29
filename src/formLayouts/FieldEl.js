import React from 'react';
import { formStyles } from './';
import { cx } from '../helpers';

export function FieldEl({ children,className, ...rest}) {
    return (
        <span className={cx(formStyles.cell, className)} {...rest} >
            {children}
        </span>
    );
}