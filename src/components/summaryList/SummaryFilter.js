import React, { useState } from 'react';
import { summaryStyle } from './index';
import { range } from './useFilters';
import filterSymbol from '../../assets/filter.svg';
import { createEmptySummary, entityTypes, getTypeFieldFromPath } from '../../helpers/globals/entityTypes';
import { hints, languageSelector } from '../../helpers';
import { keyCodes } from '../../helpers/globals/keyCodes';

const messages = {
    NL: {
        inputHint: [
            'filter op waarde, activeer met filtersymbool',
            `numerieke bereiken met ${range.name.NL}`,
            `bijv. 3${range.token}7 of 20${range.token}`,
        ],
        delFilter: 'wis filter',
        activate: 'activeer filter',
    },
    EN: {
        inputHint: [
            'filter by value, activate with filter symbol',
            `use ${range.name.EN} for numeric ranges`,
            `e.g. 3${range.token}7 or 20${range.token}`,
        ],
        delFilter: 'remove filter',
        activate: 'activate filter',
    }
};


export function SummaryFilter({entityType, mergeConstraints, elKey, accessStatus}) {
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
        // if (e.keyCode === keyCodes.enter) e.preventDefault();
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
        if (e.keyCode === keyCodes.enter) {
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
            {accessStatus.fields.map(({fieldPath, isVisible}) => {
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
