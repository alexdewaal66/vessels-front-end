import React, { Fragment, useMemo } from 'react';
import { TTC, TT } from './Tooltips';
import { entityTypes, text, languageSelector } from '../helpers';

// import { logv, pathMkr, rootMkr } from './log';

// const messages = {NL: {}, EN: {}};

function propertyLabel(key, entityName) {
    // const logPath = pathMkr(rootMkr(ShowObject), propertyLabel);
    // logv(logPath, {entityName, key, entityTypes});
    return entityName
        ? text(entityTypes[entityName].fields[key].label)
        : key;
}

export function ShowObject({entityName, data, tooltip}) {

    // if (data) console.log(`ShowObject \n\t data=`, data);

    // const TXT = messages[languageSelector()];

    return useMemo(() => (data)
            ? <>
                {entityName && (
                    <>
                        {text(entityTypes[entityName].label)}
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
