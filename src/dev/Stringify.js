import React from 'react';
import styles from './stringify.module.css';

function simpleHash(str){
    let hash = 0;
    for (const char in str) {
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return new Uint32Array([hash])[0].toString(36);
};

export function Stringify({data, children, className = styles.default}) {

    const output = JSON.stringify(data, undefined, 2);

    return (
        <div className={className}
             key={simpleHash(output)}
        >
            {children && (
                <span style={{textDecoration: "underline"}}>{children}:</span>
            )}
            <pre>{output}</pre>
        </div>
    );
}
