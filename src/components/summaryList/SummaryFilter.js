import React, { useState } from 'react';
import { summaryStyle } from './index';
import filterSymbol from '../../assets/filter.svg';
import { createEmptySummary, entityTypes, getFieldFromPath } from '../../helpers';
import { hints } from '../../helpers';
// import { logv, pathMkr, rootMkr } from '../../dev/log';

const enterKey = 13;

export function SummaryFilter({entityType, mergeConstraints, elKey}) {
    // const logRoot = rootMkr(SummaryFilter, entityType.name);

    const [inputFields, setInputFields] = useState(createEmptySummary(entityTypes, entityType));
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

    function inputSize(fieldPath) {
        // const logPath = pathMkr(logRoot, inputSize, fieldPath);
        const field = getFieldFromPath(entityTypes, entityType, fieldPath);
        const maxLength = field?.validation?.maxLength?.value ?? 4;
        // logv(logPath, {field, maxLength}, '❌');
        const size = Math.min(18, maxLength / 2);
        // logv(logPath, {field, maxLength, size});
        return size;
    }

    function inputLength(fieldPath) {
        const field = getFieldFromPath(entityTypes, entityType, fieldPath);
        const maxLength = field?.validation?.maxLength?.value || 4;
        // if (!field)  logv(`❌ ${logRoot} ${inputSize.name}(${fieldPath})`, {field, maxLength});
        return 2 * maxLength + 1;
    }

    return (
        <tr onKeyDown={enterKeyHandler} >
            {entityType.summary.map(fieldPath =>
                <th key={elKey + fieldPath + '_sort'}>
                    {/*{(label(entityType.fields, fieldPath) || fieldPath).split('').reverse().join('')}*/}
                    <input type={'text'}
                           onChange={setInputFieldsHandler(fieldPath)}
                           size={inputSize(fieldPath)}
                           maxLength={inputLength(fieldPath)}
                           className={summaryStyle.filter}
                           value={inputFields[fieldPath] || ''}
                           title={hints('filter op waarde, activeer met filtersymbool', 'numerieke bereiken met koppelteken', 'bijv. 3-7 of 20-')}
                    />
                    <button type={'button'}
                            onClick={clearFieldHandler(fieldPath)}
                            className={summaryStyle.filterButton}
                            title={hints('wis filter')}
                    >
                        ␡
                    </button>
                </th>
            )}
            <th>
                <button type={'button'}
                        onClick={filterHandler}
                        className={summaryStyle.sort}
                        title={hints('activeer filter')}
                >
                    <img src={filterSymbol} alt={'Filter symbol'}
                         className={summaryStyle.filterButton}
                    />
                </button>
            </th>
        </tr>
    );
}
