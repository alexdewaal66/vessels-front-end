import React from 'react';
import { summaryStyle } from './index';
import { SummaryFilter } from './SummaryFilter';
import { entityTypes, getFieldFromPath, hints, language } from '../../helpers';

const messages = {
    NL: {
        sortUp: 'sorteer omhoog, standaard',
        sortDn: 'sorteer omlaag',

    },
    EN: {
        sortUp: 'sort up, default',
        sortDn: 'sort down',

    }
};

export function SummaryHeading({
                                   entityType, elKey,
                                   sorting, mergeConstraints
                               }) {
    // const logRoot = rootMkr(SummaryHeading, entityType.name, '↓');
    // logv(logRoot, {elKey});

    const TXT = messages[language()];


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


    return (
        <>
            <tr>
                {entityType.summary.map(fieldPath => {
                    const field =  getFieldFromPath(entityTypes, entityType, fieldPath);
                        return (<th key={elKey + fieldPath + '_h'}>
                            {/*{entityType.fields[fieldPath].label || fieldPath}*/}
                            {field.label || fieldPath}
                            <span>
                            <button type={'button'}
                                    onClick={up(fieldPath, field.type)}
                                    className={summaryStyle.sort}
                                    title={hints('▲ = ' + TXT.sortUp)}
                            >
                                {sorting.isOrderUp(fieldPath) ? '△' : '▲'}
                            </button>
                            <button type={'button'}
                                    onClick={down(fieldPath, field.type)}
                                    className={summaryStyle.sort}
                                    title={hints('▼ = ' + TXT.sortDn)}
                            >
                                {sorting.isOrderUp(fieldPath) ? '▼' : '▽'}
                            </button>
                        </span>
                        </th>);
                    }
                )}
                <th/>
            </tr>
            <SummaryFilter entityType={entityType}
                           mergeConstraints={mergeConstraints}
                           elKey={elKey}
            />
        </>
    );
}

