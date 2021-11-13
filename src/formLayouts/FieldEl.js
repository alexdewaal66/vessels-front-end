import React from 'react';
import { formStyles } from './';

export function FieldEl({ children, ...rest}) {
    return (
        <span className={formStyles.cell} {...rest} >
            {children}
        </span>
    );
}