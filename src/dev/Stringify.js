import React from 'react';

export function Stringify({data, children}) {
    return (
        <div style={{
            maxHeight: "250px",
            overflowY: "scroll",
            width: "max-content",
            padding: "1em",
            border: "1px solid white"
        }}
        >
            {children && (
                <span style={{textDecoration: "underline"}}>{children}:</span>
            )}
            <pre>{JSON.stringify(data, undefined, 2)}</pre>
        </div>
    );
}
