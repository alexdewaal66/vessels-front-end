import React, { useMemo } from 'react';
import { TTC, TT } from './Tooltips';
import { entityTypes } from '../helpers';
import { logv, pathMkr, rootMkr } from './log';

function property(key, entityName) {
    const logPath = pathMkr(rootMkr(ShowObject), property);
    logv(logPath, {entityName, key, entityTypes});
    return entityName
        ? entityTypes[entityName].properties[key]?.label
        : key;
}

export function ShowObject({entityName, data, tooltip}) {

    // if (data) console.log(`ShowObject \n\t data=`, data);


    return useMemo(() => (data)
        ? <>
            {entityName && (
                <>
                    {entityTypes[entityName].label}
                </>
            )}
            <ul>
                {Object.entries(data).map(([key, value]) =>
                    <>{(key !== 'timestamp') && (
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
                                ? <ShowObject data={value}/>
                                : <>{value}</>
                            }
                        </li>
                    )}
                    </>
                )
                }
            </ul>
        </>
        : 'null',
        [entityName, data, tooltip])
}
