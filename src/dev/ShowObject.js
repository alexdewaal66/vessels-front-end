import React, { useMemo } from 'react';
import { TTC, TT } from './Tooltips';
import { entitiesMetadata } from '../helpers/entitiesMetadata';

export function ShowObject({entityName, data, tooltip}) {
    function property(key) {
        return entityName
            ? entitiesMetadata[entityName].properties[key].label
            : key;
    }

    // if (data) console.log(`ShowObject \n\t data=`, data);


    return useMemo(() => (data)
        ? <>
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
                                    {property(key)}:&nbsp;
                                </span>
                        }
                        {typeof value === 'object'
                            ? <ShowObject data={value}/>
                            : <>{value}</>
                        }
                    </li>
                )
                }
            </ul>
        </>
        : 'null',
        [entityName, data, tooltip])
}
