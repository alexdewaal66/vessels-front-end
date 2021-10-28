import React from 'react';
import { summaryStyle } from './index';
import filterSymbol from '../../assets/filter.svg';
import { lgv } from '../../dev/log';

export function SummaryHeading({
                                   metadata, elKey,
                                   setSorting, setFiltering
                               }) {
    let logRoot = `SummaryHeading(${metadata.name})`;

    // console.log(`metadata=`, metadata, `elKey=`, elKey);

    function label(object, propertyName) {
        const parts = propertyName.split('.');
        return object[parts[0]].label;
    }

    const up = (propertyName) => () => {
        const logPath = logRoot + ' » up()';
        lgv(logPath, {propertyName});
        setSorting({propertyName, order: 'up'})
    };

    const down = (propertyName) => () => {
        const logPath = logRoot + ' » down()';
        lgv(logPath, {propertyName});
        setSorting({propertyName, order: 'down'})
    };

    const filter = (propertyName) => () => {
    };

    const filterFieldHandler = (propertyName) => () => {
    };

    function inputSize(propertyName) {
        const property = metadata.properties[propertyName];
        const maxLength = property?.validation?.maxLength || 4;
        lgv(logRoot + `inputSize(${propertyName})`, {property, maxLength});
        return Math.min(20, maxLength);
    }


    return (
        <>
            <tr>
                {metadata.summary.map(propertyName =>
                    <th key={elKey + propertyName + '_h'}>
                        {/*{metadata.properties[propertyName].label || propertyName}*/}
                        {label(metadata.properties, propertyName) || propertyName}
                        <button type={'button'} onClick={up(propertyName)} className={summaryStyle.sort}>▲</button>
                        <button type={'button'} onClick={down(propertyName)} className={summaryStyle.sort}>▼</button>
                    </th>
                )}
            </tr>
            {/*<tr>*/}
            {/*    {metadata.summary.map(propertyName =>*/}
            {/*        <th key={elKey + propertyName + '_sort'}>*/}
            {/*            /!*{(label(metadata.properties, propertyName) || propertyName).split('').reverse().join('')}*!/*/}
            {/*            <input type={'text'}*/}
            {/*                   onChange={filterFieldHandler(propertyName)}*/}
            {/*                   size={inputSize(propertyName)}*/}
            {/*                   className={summaryStyle.filter}*/}
            {/*            />*/}
            {/*            <button type={'button'} onClick={filter(propertyName)}*/}
            {/*                    className={summaryStyle.sort}*/}
            {/*            >*/}
            {/*                <img src={filterSymbol} alt={'Filter symbol'}*/}
            {/*                     className={summaryStyle.filter}*/}
            {/*                />*/}
            {/*            </button>*/}
            {/*            /!*⨃⩒⩣⩡Y⊻⋁Υ🝖*!/*/}
            {/*        </th>*/}
            {/*    )}*/}
            {/*</tr>*/}
        </>
    );
}

