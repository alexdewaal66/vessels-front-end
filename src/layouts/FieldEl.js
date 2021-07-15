import React from 'react';
import forms from '../layouts/forms.module.css';

export function FieldEl({ children, ...rest}) {
    return (
        <span className={forms.cell} {...rest} >
            {children}
        </span>
    );
}