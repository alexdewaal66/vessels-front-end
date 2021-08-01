import React from 'react';
import { TTC, TT } from './Tooltips';

export function ShowObject({obj}) {
    if (obj) {
        console.log(`obj=`, obj);
        return (
            <ul>
                {Object.entries(obj).map(([key, value]) =>
                    <li key={key}>
                        <TTC>{key} :
                            <TT>{typeof value}</TT>
                        </TTC>
                        {typeof value === 'object'
                            ? <ShowObject obj={value} />
                            : <>{value}</>
                        }
                    </li>
                )}
            </ul>
        );
    } else return null;
}
