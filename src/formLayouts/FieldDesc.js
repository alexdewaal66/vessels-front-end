import React from 'react';
import { formStyles } from './';

export function FieldDesc({ children, ...rest}) {
    return (
        <span className={formStyles.cell} {...rest} >
            {children}
        </span>
    );
}