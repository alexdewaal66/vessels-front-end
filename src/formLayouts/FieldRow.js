import React from 'react';
import { formStyles } from './';

export function FieldRow({ children, elKey, field, ...rest}) {
    return (
        <label className={formStyles.row}
               key={elKey + 'label'}
               htmlFor={field}
               {...rest} >
            {children}
        </label>
    );
}