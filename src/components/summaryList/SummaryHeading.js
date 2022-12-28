import React from 'react';
import { summaryStyle } from './index';
import { SummaryFilter } from './SummaryFilter';
import { hints, text, languageSelector } from '../../helpers';
import { logCondition, logv, rootMkr } from '../../dev/log';
import { CollapseButton } from './CollapseButton';

const messages = {
    NL: {
        sortUp: 'sorteer omhoog',
        sortDn: 'sorteer omlaag',
    },
    EN: {
        sortUp: 'sort up',
        sortDn: 'sort down',
    }
};

export function SummaryHeading({
                                   entityType, elKey,
                                   sorting, mergeConstraints,
                                   small, toggleCollapsed, accessStatus
                               }) {
    const logRoot = rootMkr(SummaryHeading, entityType.name, '↓');
    const doLog = logCondition(SummaryHeading, entityType.name);
    if (doLog) logv(logRoot, {elKey});

    const TXT = messages[languageSelector()];


    const up = (fieldPath, fieldType) => () => {
        // const logPath = pathMkr(logRoot, up.name);
        // logv(logPath, {propertyName});
        sorting.setOrder({propertyName: fieldPath, order: 'up', fieldType})
    };

    const down = (fieldPath, fieldType) => () => {
        // const logPath = pathMkr(logRoot, down.name);
        // logv(logPath, {propertyName});
        sorting.setOrder({propertyName: fieldPath, order: 'down', fieldType})
    };

    function fieldLabel(fieldPath, field) {
        return entityType.summaryLabel?.[fieldPath] || field.label;
    }


    return (
        <>
            <tr>
                {accessStatus.fields.map(({fieldPath, typeField, isVisible}) => {
                    if (isVisible)
                            return (
                                <th key={elKey + fieldPath + '_h'}>
                                    {text(fieldLabel(fieldPath, typeField)) || fieldPath}
                                    <span>
                                    {!!typeField ? (
                                        <>
                                            <button type={'button'}
                                                    onClick={up(fieldPath, typeField.type)}
                                                    className={summaryStyle.sort}
                                                    title={hints('▲ = ' + TXT.sortUp)}
                                            >
                                                {sorting.isOrderUp(fieldPath) ? '▲' : '△'}
                                            </button>
                                            <button type={'button'}
                                                    onClick={down(fieldPath, typeField.type)}
                                                    className={summaryStyle.sort}
                                                    title={hints('▼ = ' + TXT.sortDn)}
                                            >
                                                {sorting.isOrderDown(fieldPath) ? '▼' : '▽'}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            entityType.name:{entityType.name}
                                            <br/>
                                            fieldPath:{fieldPath}
                                        </>
                                    )}
                                </span>
                                </th>
                            );
                        else return null;
                    }
                )}
                <th style={{textAlign: 'right'}}>
                    <CollapseButton small={small} toggleCollapsed={toggleCollapsed}/>
                </th>
            </tr>
            <SummaryFilter entityType={entityType}
                           mergeConstraints={mergeConstraints}
                           elKey={elKey}
                           accessStatus={accessStatus}
            />
        </>
    );
}

