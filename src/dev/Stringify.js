import React from 'react';

export function Stringify({data}) {
    return (
        <div>
            <pre>
            {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}
