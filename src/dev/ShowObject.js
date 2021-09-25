import React from 'react';
import { TTC, TT } from './Tooltips';
import { entitiesMetadata } from '../helpers/entitiesMetadata';

export function ShowObject({entityName, data, tooltip}) {
    if (data) {
        // console.log(`data=`, data);
        return (
            <>
                {entityName && (
                    <>
                        {entitiesMetadata[entityName].label}
                    </>
                )}
                <ul>
                    {Object.entries(data).map(([key, value]) =>
                        <li key={key} style={{listStyleType: 'none'}}>
                            {tooltip
                                ? <TTC>{key} :
                                    <TT>{typeof value}</TT>
                                </TTC>
                                : <span style={{whiteSpace: 'pre'}}>
                                    {entityName
                                        ? entitiesMetadata[entityName].properties[key].label
                                        : key
                                    }
                                    :
                                </span>
                            }
                            {typeof value === 'object'
                                ? <ShowObject data={value}/>
                                : <>{value}</>
                            }
                        </li>
                    )}
                </ul>
            </>
        );
    } else return null
}
