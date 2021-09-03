import React from 'react';
import forms from './/forms.module.css';

export function FieldRow({ children, elKey, ...rest}) {
    return (
        <label className={forms.row} key={elKey + 'label'} {...rest} >
            {children}
        </label>
    );
}