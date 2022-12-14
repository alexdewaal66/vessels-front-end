import React, { useState } from 'react';
import { summaryStyle } from './index';
import filterSymbol from '../../assets/filter.svg';
import { entityTypes, createEmptySummary, getTypeFieldFromPath } from '../../helpers/globals/entityTypes';
import { languageSelector } from '../../helpers';
import { hints } from '../../helpers';

const enterKey = 13;

const messages = {
    NL: {
        inputHint: ['filter op waarde, activeer met filtersymbool', 'numerieke bereiken met koppelteken', 'bijv. 3-7 of 20-'],
        delFilter: 'wis filter',
        activate: 'activeer filter',
    },
    EN: {
        inputHint: ['filter by value, activate with filtersymbol', 'use dash for numeric ranges', 'e.g. 3-7 or 20-'],
        delFilter: 'remove filter',
        activate: 'activate filter',
    }
};


export function SummaryFilter({entityType, mergeConstraints, elKey, fieldStatuses}) {
    // const logRoot = rootMkr(SummaryFilter, entityType.name);


    const TXT = messages[languageSelector()];

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
        const field = getTypeFieldFromPath(entityTypes, entityType, fieldPath);
        const maxLength = field?.validation?.maxLength?.value ?? 4;
        // logv(logPath, {field, maxLength}, '❌');
        const size = Math.min(18, maxLength / 2);
        // logv(logPath, {field, maxLength, size});
        return size;
    }

    function inputLength(fieldPath) {
        const field = getTypeFieldFromPath(entityTypes, entityType, fieldPath);
        const maxLength = field?.validation?.maxLength?.value || 4;
        // if (!field)  logv(`❌ ${logRoot} ${inputSize.name}(${fieldPath})`, {field, maxLength});
        return 2 * maxLength + 1;
    }

    return (
        <tr onKeyDown={enterKeyHandler}>
            {fieldStatuses.map(({fieldPath, isVisible}) => {
                if (isVisible)
                        return (
                            <th key={elKey + fieldPath + '_sort'}>
                                {/*{(text(entityType.fields, fieldPath) || fieldPath).split('').reverse().join('')}*/}
                                <input type={'text'}
                                       onChange={setInputFieldsHandler(fieldPath)}
                                       size={inputSize(fieldPath)}
                                       maxLength={inputLength(fieldPath)}
                                       className={summaryStyle.filter}
                                       value={inputFields[fieldPath] || ''}
                                       title={hints(TXT.inputHint)}
                                />
                                <button type={'button'}
                                        onClick={clearFieldHandler(fieldPath)}
                                        className={summaryStyle.filterButton}
                                        title={hints(TXT.delFilter)}
                                >
                                    ␡
                                </button>
                            </th>
                        );
                    else return null;
                }
            )}
            <th>
                <button type={'button'}
                        onClick={filterHandler}
                        className={summaryStyle.sort}
                        title={hints(TXT.activate)}
                >
                    <img src={filterSymbol} alt={'Filter symbol'}
                         className={summaryStyle.filterButton}
                    />
                </button>
            </th>
        </tr>
    );
}
