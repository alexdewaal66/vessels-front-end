import React from 'react';
import { cx } from '../../helpers/multipleStyles';

export function Empty({children, className, ...rest}) {
    return (
        <div className={cx('', className)} {...rest}>
            {children}
        </div>
    );
}
