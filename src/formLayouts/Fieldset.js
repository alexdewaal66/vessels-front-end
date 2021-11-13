import React from 'react';
import { formStyles } from './'

export function Fieldset({ children, border, ...rest}) {
    let style = formStyles.border;
    if (!border) {
        style = formStyles.noBorder;
    }

    return (
        <fieldset className={style} {...rest} >
            {children}
        </fieldset>
    );
}