import React, { useState } from 'react';
import { summaryStyle } from './index';
import filterSymbol from '../../assets/filter.svg';
import { createEmptySummary, getSummaryProp } from '../../helpers';

const enterKey = 13;

export function SummaryFilter({entityType, mergeConstraints, elKey}) {
    // const logRoot = rootMkr(SummaryFilter, entityType.name);

    const [inputFields, setInputFields] = useState(createEmptySummary(entityType));
    // logv(logRoot, {inputFields});

    const mergeInputFields = (key, changedValue) => {
        // const logPath = pathMkr(logRoot, mergeInputFields, key);
        setInputFields(currentValues => {
                const newValues = {...currentValues, [key]: changedValue};
                // logv(logPath, {currentValues, changedValue, newValues});
                return newValues;
            }
        );
    }

    const setInputFieldsHandler = (key) => (e) => {
        // const logPath = pathMkr(logRoot, setInputFieldsHandler, key);
        let changedValue = e.target.value;
        mergeInputFields(key, changedValue);
    }

    const clearFieldHandler = (key) => () => {
        // const logPath = pathMkr(logRoot, clearFieldHandler, key);
        // logv(logPath, {inputFields});
        mergeInputFields(key, '');
        mergeConstraints({[key]: ''});
    }

    const filterHandler = () => {
        // const logPath = pathMkr(logRoot, filterHandler);
        const values = {...inputFields};
        mergeConstraints(values);
    }

    const enterKeyHandler = (e) => {
        // const logPath = pathMkr(logRoot, enterKeyHandler);
        // logv(logPath, {key: e.keyCode});
        if (e.keyCode === enterKey) {
            filterHandler();
        }
    }

    function inputSize(key) {
        const property = getSummaryProp(entityType, key);
        const maxLength = property?.validation?.maxLength || 4;
        // if (!property)  logv(`❌ ${logRoot} ${inputSize.name}(${key})`, {property, maxLength});
        return Math.min(18, maxLength / 2);
    }

    function inputLength(key) {
        const property = getSummaryProp(entityType, key);
        const maxLength = property?.validation?.maxLength || 4;
        // if (!property)  logv(`❌ ${logRoot} ${inputSize.name}(${key})`, {property, maxLength});
        return 2 * maxLength + 1;
    }

    return (
        <tr onKeyDown={enterKeyHandler} >
            {entityType.summary.map(propertyName =>
                <th key={elKey + propertyName + '_sort'}>
                    {/*{(label(entityType.properties, propertyName) || propertyName).split('').reverse().join('')}*/}
                    <input type={'text'}
                           onChange={setInputFieldsHandler(propertyName)}
                           size={inputSize(propertyName)}
                           maxLength={inputLength(propertyName)}
                           className={summaryStyle.filter}
                           value={inputFields[propertyName] || ''}
                    />
                    <button type={'button'}
                            onClick={clearFieldHandler(propertyName)}
                            className={summaryStyle.filterButton}
                    >
                        ␡
                    </button>
                </th>
            )}
            <th>
                <button type={'button'}
                        onClick={filterHandler}
                        className={summaryStyle.sort}
                >
                    <img src={filterSymbol} alt={'Filter symbol'}
                         className={summaryStyle.filterButton}
                    />
                </button>
            </th>
        </tr>
    );
}
