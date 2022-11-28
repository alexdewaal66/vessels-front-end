import React from 'react';
import tooltip from './tooltip.module.css'

export function TooltipContainer({children, ...rest}) {
    return (
        <span className={tooltip.container} {...rest}>
            {children}
        </span>
    );
}

export function Tooltip({children, ...rest}) {
    return (
        <span className={tooltip.text} {...rest}>
            {children}
        </span>
    );
}
