import React from 'react';
import { formStyles } from './';

export function ButtonRow({children, elkey}) {
    return (
        <span className={formStyles.row}
              key={elkey + 'buttons'}
        >
            {children}
        </span>
    );
}
