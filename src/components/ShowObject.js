import React, { Fragment, useMemo } from 'react';
import { TTC, TT } from './Tooltips';
import { entityTypes } from '../helpers';

// import { logv, pathMkr, rootMkr } from './log';

function propertyLabel(key, entityName) {
    // const logPath = pathMkr(rootMkr(ShowObject), propertyLabel);
    // logv(logPath, {entityName, key, entityTypes});
    return entityName
        ? entityTypes[entityName].fields[key]?.label
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
                        <Fragment key={key}>
                            {(key !== 'timestamp') && (
                                <li style={{listStyleType: 'none'}}>
                                    {tooltip
                                        ? <TTC>
                                            {key} : <TT>{typeof value}</TT>
                                        </TTC>
                                        : <span style={{whiteSpace: 'pre'}}>
                                            {propertyLabel(key, entityName)}:&nbsp;
                                        </span>
                                    }
                                    {typeof value === 'object'
                                        ? <ShowObject data={value}/>
                                        : <>{value}</>
                                    }
                                </li>
                            )}
                        </Fragment>
                    )
                    }
                </ul>
            </>
            : 'null',
        [entityName, data, tooltip])
}
