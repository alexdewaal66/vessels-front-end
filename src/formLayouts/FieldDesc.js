import React from 'react';
import forms from './/forms.module.css';

export function FieldDesc({ children, ...rest}) {
    return (
        <span className={forms.cell} {...rest} >
            {children}
        </span>
    );
}