import React from 'react';
import { formStyles } from './';

export function ButtonRow({children, elkey, ...rest}) {
    return (
        <>
            {/*todo: use css, not a spacer*/}
            <span className={formStyles.row}
                  key={elkey + 'spacer'}
                  {...rest}
            >
                &nbsp;
            </span>
            <span className={formStyles.row}
                  key={elkey + 'buttons'}
                  {...rest}
            >
                {children}
            </span>
        </>
    );
}
