import React, { Fragment, useMemo } from 'react';
import { TooltipContainer, Tooltip } from './Tooltips';
import { entityTypes, hiddenProps } from '../helpers/globals/entityTypes';
import { text } from '../helpers';
import { logCondition, logv, pathMkr, rootMkr } from '../dev/log';

// import { logv, pathMkr, rootMkr } from './log';

// const messages = {NL: {}, EN: {}};

function propertyLabel(key, entityName) {
    const logPath = pathMkr(rootMkr(ShowObject), propertyLabel);
    const doLog = logCondition(ShowObject, entityName);
    if (doLog) logv(logPath, {entityName, key, entityTypes});
    if (entityName) {
        const typeFields = entityTypes[entityName].fields;
        if (typeFields[key])
            return text(typeFields[key].label);
    }
    return key;
}

export function ShowObject({entityName, data, tooltip}) {
    // const logRoot = rootMkr(ShowObject, entityName);
    // const doLog = logCondition(ShowObject, entityName);

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
                            {(!hiddenProps.includes(key)) && (
                                <li style={{listStyleType: 'none'}}>
                                    {tooltip
                                        ? <TooltipContainer>
                                            {key} : <Tooltip>{typeof value}</Tooltip>
                                        </TooltipContainer>
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
