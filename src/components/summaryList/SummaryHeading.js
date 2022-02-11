import React from 'react';
import { summaryStyle } from './index';
import { SummaryFilter } from './SummaryFilter';

export function SummaryHeading({
                                   metadata, elKey,
                                   setSorting, mergeConstraints
                               }) {
    // const logRoot = rootMkr(SummaryHeading, metadata.name, '↓');
    // logv(logRoot, {elKey});

    function label(object, propertyName) {
        const parts = propertyName.split('.');
        return object[parts[0]].label;
    }

    const up = (propertyName) => () => {
        // const logPath = pathMkr(logRoot, up.name);
        // logv(logPath, {propertyName});
        setSorting({propertyName, order: 'up'})
    };

    const down = (propertyName) => () => {
        // const logPath = pathMkr(logRoot, down.name);
        // logv(logPath, {propertyName});
        setSorting({propertyName, order: 'down'})
    };


    return (
        <>
            <tr>
                {metadata.summary.map(propertyName =>
                    <th key={elKey + propertyName + '_h'}>
                        {/*{metadata.properties[propertyName].label || propertyName}*/}
                        {label(metadata.properties, propertyName) || propertyName}
                        <span>
                            <button type={'button'} onClick={up(propertyName)} className={summaryStyle.sort}>▲</button>
                            <button type={'button'} onClick={down(propertyName)} className={summaryStyle.sort}>▼
                            </button>
                        </span>
                    </th>
                )}
                <th/>
            </tr>
            <SummaryFilter metadata={metadata}
                           mergeConstraints={mergeConstraints}
                           elKey={elKey}
            />
        </>
    );
}

