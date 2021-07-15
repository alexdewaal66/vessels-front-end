import React from 'react';
import forms from '../layouts/forms.module.css';

export function FieldDesc({ children, ...rest}) {
    return (
        <span className={forms.cell} {...rest} >
            {children}
        </span>
    );
}