import React from 'react';
import forms from './/forms.module.css';

export function Form({ children, ...rest}) {
    return (
        <form className={forms.form} {...rest} >
            {children}
        </form>
    );
}