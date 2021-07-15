import React from 'react';
import forms from '../layouts/forms.module.css';

export function FieldRow({ children, ...rest}) {
    return (
        <label className={forms.row} {...rest} >
            {children}
        </label>
    );
}