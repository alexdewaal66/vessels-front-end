import React from 'react';
import tooltip from './tooltip.module.css'

export function TTC({children, ...rest}) {
    return (
        <span className={tooltip.container} {...rest}>
            {children}
        </span>
    );
}

export function TT({children, ...rest}) {
    return (
        <span className={tooltip.text} {...rest}>
            {children}
        </span>
    );
}
