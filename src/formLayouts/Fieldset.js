import React from 'react';
import { formStyles } from './'

export function Fieldset({ children, border, ...rest}) {
    const style = border ? formStyles.border : formStyles.noBorder;

    return (
        <fieldset className={style} {...rest} >
            {children}
        </fieldset>
    );
}