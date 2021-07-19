import React from 'react';
import forms from './/forms.module.css';

export function Fieldset({ children, ...rest}) {
    return (
        <fieldset className={forms.table} {...rest} >
            {children}
        </fieldset>
    );
}