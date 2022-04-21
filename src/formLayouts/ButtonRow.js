import React from 'react';
import { formStyles } from './';

export function ButtonRow({children, elkey}) {
    return (
        <>
            {/*todo: use css, not a spacer*/}
            <span className={formStyles.row}
                  key={elkey + 'spacer'}
            >
                &nbsp;
            </span>
            <span className={formStyles.row}
                  key={elkey + 'buttons'}
            >
                {children}
            </span>
        </>
    );
}
