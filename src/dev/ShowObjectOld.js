import React, { useMemo } from 'react';
import { TTC, TT } from './Tooltips';
import { entitiesMetadata } from '../helpers';

function property(key, entityName) {
    return entityName
        ? entitiesMetadata[entityName].properties[key].label
        : key;
}

export function ShowObjectOld({entityName, data, tooltip}) {

    // if (data) console.log(`ShowObjectOld \n\t data=`, data);


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
                                    {property(key, entityName)}:&nbsp;
                                </span>
                        }
                        {typeof value === 'object'
                            ? <ShowObjectOld data={value}/>
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
