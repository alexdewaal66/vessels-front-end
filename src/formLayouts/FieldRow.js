import React from 'react';
import forms from './/forms.module.css';

export function FieldRow({ children, elKey, field, ...rest}) {
    return (
        <label className={forms.row}
               key={elKey + 'label'}
               htmlFor={field}
               {...rest} >
            {children}
        </label>
    );
}