import React from 'react';

export function ShowObject({obj}) {
    if (obj)
    return (
        <ul>
            {Object.entries(obj).map((key, value) =>
                <li>
                    {typeof value === 'object'
                        ? <ShowObject obj={value}/>
                        : <>{value}</>
                    }
                </li>
            )}
        </ul>
    );
    else return null;
}
