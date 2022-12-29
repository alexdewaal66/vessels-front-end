import React from 'react';
import { formStyles } from './';
import { cx } from '../helpers';

export function FieldRow({children, elKey, field, className, ...rest}) {

    return (
        <label className={cx(formStyles.row, className)}
               key={elKey + 'label'}
               htmlFor={field}
               {...rest} >
            {children}
        </label>
    );
}