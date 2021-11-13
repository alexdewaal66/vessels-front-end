import React from 'react';
import { formStyles } from './';

export function Form({children, ...rest}) {
    return (
        <form className={formStyles.form} {...rest} >
            {children}
        </form>
    );
}