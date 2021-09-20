import React from 'react';
import { TTC, TT } from './Tooltips';
import { entitiesMetadata } from '../helpers/entitiesMetadata';

export function ShowObject({entityName, data, tooltip}) {
    if (data) {
        // console.log(`data=`, data);
        return (
            <ul>
                {Object.entries(data).map(([key, value]) =>
                    <li key={key}>
                        {tooltip ? (
                            <TTC>{key} :
                                <TT>{typeof value}</TT>
                            </TTC>
                        ) : (
                            <>{entityName ? (
                                <>
                                    {entitiesMetadata[entityName].properties[key].label} :
                                </>
                            ) : (
                                <>
                                    {key} :
                                </>
                            )}
                            </>
                        )}
                        {typeof value === 'object'
                            ? <ShowObject data={value}/>
                            : <>{value}</>
                        }
                    </li>
                )}
            </ul>
        );
    } else return null;
}
