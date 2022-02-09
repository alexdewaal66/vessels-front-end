import React from 'react';
import styles from './stringify.module.css';

export function Stringify({data, children, className = styles.default}) {
    return (
        <div className={className}
        >
            {children && (
                <span style={{textDecoration: "underline"}}>{children}:</span>
            )}
            <pre>{JSON.stringify(data, undefined, 2)}</pre>
        </div>
    );
}
