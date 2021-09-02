import React from 'react';
import { TTC, TT } from './Tooltips';

export function ShowObject({data}) {
    if (data) {
        // console.log(`data=`, data);
        return (
            <ul>
                {Object.entries(data).map(([key, value]) =>
                    <li key={key}>
                        <TTC>{key} :
                            <TT>{typeof value}</TT>
                        </TTC>
                        {typeof value === 'object'
                            ? <ShowObject data={value} />
                            : <>{value}</>
                        }
                    </li>
                )}
            </ul>
        );
    } else return null;
}
