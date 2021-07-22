import React from 'react';
import forms from './forms.module.css';

export function Fieldset({ children, border, ...rest}) {
    let style = forms.table;
    if (!border) {
        style += ' ' + forms.noBorder;
    }
    return (
        <fieldset className={style} {...rest} >
            {children}
        </fieldset>
    );
}