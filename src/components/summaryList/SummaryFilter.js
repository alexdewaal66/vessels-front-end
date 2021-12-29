import React from 'react';
import { summaryStyle } from './index';
import { logv } from '../../dev/log';
import filterSymbol from '../../assets/filter.svg';

export function SummaryFilter({metadata, elKey}) {
    const logRoot = SummaryFilter.name  + `(${metadata.name})`;

    const filter = (propertyName) => () => {};

    const filterFieldHandler = (propertyName) => () => {};

    function inputSize(propertyName) {
        const property = metadata.properties[propertyName];
        const maxLength = property?.validation?.maxLength || 4;
        // logv(logRoot + `inputSize(${propertyName})`, {property, maxLength});
        return Math.min(20, maxLength);
    }

    return (
        <tr>
            {metadata.summary.map(propertyName =>
                <th key={elKey + propertyName + '_sort'}>
                    {/*{(label(metadata.properties, propertyName) || propertyName).split('').reverse().join('')}*/}
                    <input type={'text'}
                           onChange={filterFieldHandler(propertyName)}
                           size={inputSize(propertyName)}
                           className={summaryStyle.filter}
                    />
                    <button type={'button'} onClick={filter(propertyName)}
                            className={summaryStyle.sort}
                    >
                        <img src={filterSymbol} alt={'Filter symbol'}
                             className={summaryStyle.filter}
                        />
                    </button>
                </th>
            )}
        </tr>
    );
}

/* ⨃⩒⩣⩡Y⊻⋁Υ🝖 */
