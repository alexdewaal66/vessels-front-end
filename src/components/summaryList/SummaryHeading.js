import React from 'react';
import { summaryStyle } from './index';
import { logv } from '../../dev/log';
import { SummaryFilter } from './SummaryFilter';

export function SummaryHeading({
                                   metadata, elKey,
                                   setSorting, setFiltering
                               }) {
    const logRoot = `SummaryHeading(${metadata.name})`;

    // console.log(`metadata=`, metadata, `elKey=`, elKey);

    function label(object, propertyName) {
        const parts = propertyName.split('.');
        return object[parts[0]].label;
    }

    const up = (propertyName) => () => {
        const logPath = logRoot + ' » up()';
        // logv(logPath, {propertyName});
        setSorting({propertyName, order: 'up'})
    };

    const down = (propertyName) => () => {
        const logPath = logRoot + ' » down()';
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
            </tr>
            {/*<SummaryFilter metadata={metadata} elKey={elKey} />*/}
        </>
    );
}

