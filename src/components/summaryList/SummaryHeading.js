import React from 'react';
import { summaryStyle } from './index';
import { SummaryFilter } from './SummaryFilter';

export function SummaryHeading({
                                   entityType, elKey,
                                   sorting, mergeConstraints
                               }) {
    // const logRoot = rootMkr(SummaryHeading, entityType.name, '↓');
    // logv(logRoot, {elKey});

    function label(object, propertyName) {
        const parts = propertyName.split('.');
        return object[parts[0]].label;
    }

    const up = (propertyName) => () => {
        // const logPath = pathMkr(logRoot, up.name);
        // logv(logPath, {propertyName});
        sorting.setOrder({propertyName, order: 'up'})
    };

    const down = (propertyName) => () => {
        // const logPath = pathMkr(logRoot, down.name);
        // logv(logPath, {propertyName});
        sorting.setOrder({propertyName, order: 'down'})
    };


    return (
        <>
            <tr>
                {entityType.summary.map(propertyName =>
                    <th key={elKey + propertyName + '_h'}>
                        {/*{entityType.properties[propertyName].label || propertyName}*/}
                        {label(entityType.properties, propertyName) || propertyName}
                        <span>
                            <button type={'button'} onClick={up(propertyName)} className={summaryStyle.sort}>
                                {sorting.isOrderUp(propertyName) ? '△' : '▲'}
                            </button>
                            <button type={'button'} onClick={down(propertyName)} className={summaryStyle.sort}>
                                {sorting.isOrderUp(propertyName) ? '▼' : '▽'}
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

