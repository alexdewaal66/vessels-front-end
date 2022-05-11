import React from 'react';
import { summaryStyle } from './index';
import { SummaryFilter } from './SummaryFilter';

export function SummaryHeading({
                                   entityType, elKey,
                                   sorting, mergeConstraints
                               }) {
    // const logRoot = rootMkr(SummaryHeading, entityType.name, '↓');
    // logv(logRoot, {elKey});

    function label(fields, fieldPath) {
        const parts = fieldPath.split('.');
        return fields[parts[0]].label;
    }

    const up = (fieldPath) => () => {
        // const logPath = pathMkr(logRoot, up.name);
        // logv(logPath, {propertyName});
        sorting.setOrder({propertyName: fieldPath, order: 'up'})
    };

    const down = (fieldPath) => () => {
        // const logPath = pathMkr(logRoot, down.name);
        // logv(logPath, {propertyName});
        sorting.setOrder({propertyName: fieldPath, order: 'down'})
    };


    return (
        <>
            <tr>
                {entityType.summary.map(fieldPath =>
                    <th key={elKey + fieldPath + '_h'}>
                        {/*{entityType.fields[fieldPath].label || fieldPath}*/}
                        {label(entityType.fields, fieldPath) || fieldPath}
                        <span>
                            <button type={'button'} onClick={up(fieldPath)} className={summaryStyle.sort}>
                                {sorting.isOrderUp(fieldPath) ? '△' : '▲'}
                            </button>
                            <button type={'button'} onClick={down(fieldPath)} className={summaryStyle.sort}>
                                {sorting.isOrderUp(fieldPath) ? '▼' : '▽'}
                            </button>
                        </span>
                    </th>
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

