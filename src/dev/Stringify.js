import React from 'react';
import styles from './stringify.module.css';

function simpleHash(str) {
    let hash = 0;
    for (const char in str) {
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return new Uint32Array([hash])[0].toString(36);
}

export function Stringify({data, children, isInline}) {
    const style = isInline ? styles.inline : styles.default;

    const output = JSON.stringify(data, undefined, 4);

    return (
        <div className={style}
             key={simpleHash(output)}
        >
            {children && (
                <span style={{textDecoration: "underline"}}>{children}:</span>
            )}
            <pre>{output}</pre>
        </div>
    );
}
