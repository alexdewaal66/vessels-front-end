import { useState } from 'react';
import { createEmptySummary, emptyFields, types, useConditionalEffect } from '../../helpers';
import { logv } from '../../dev/log';

// export function useFilters(operation, list, metadata) {
export function useFilters(metadata) {
    const logRoot = `${useFilters.name}()`;
    // const [constraints, setConstraints] = useState(emptyFields(metadata.summary));
    const [constraints, setConstraints] = useState(createEmptySummary(metadata));
    const [noConstraints, setNoConstraints] = useState(true);

    function mergeConstraints(updatedValues) {
        const logPath = `➖➖ ${logRoot} » ${mergeConstraints.name}()`;
        setConstraints(currentValues => {
                const newValues = {...currentValues, ...updatedValues};
                const allEmpty = Object.values(newValues).every(value => !(value || value === 0));
                setNoConstraints(allEmpty);
                logv(logPath, {newValues, allEmpty});
                return newValues;
            }
        );
    }

    // useConditionalEffect(
    //     () => operation([...list]),
    //     !!constraints && !!list,
    //     [constraints]
    // );

    function matchField(item, constraint) {
        const logPath = `${logRoot} » ${matchField.name}(↓, ↓)`;
        const [fieldName, filterValue] = constraint;
        if (!filterValue) return true;
        if (!item[fieldName]) return true;
        const value = item[fieldName];
        switch (metadata.properties[fieldName].type) {
            case types.str:
                const lowerCaseFieldValue = value.toLowerCase();
                return lowerCaseFieldValue.includes(filterValue.toLowerCase() || '');
            case types.num:
                logv(logPath, {item, constraint});
                let comparator = '=';
                let measure1 = filterValue;
                let measure2;
                if ('=<>'.includes(filterValue[0])) {
                    comparator = filterValue[0];
                    measure1 = filterValue.substring(1);
                } else if (filterValue.includes('-')) {
                    comparator = '-';
                    [measure1, measure2] = filterValue.split('-');
                }
                measure1 = +measure1;
                measure2 = +measure2;
                switch (comparator) {
                    case '<':
                        return value < measure1;
                    case '>':
                        return value > measure1;
                    case '-':
                        logv(logPath, {measure1, measure2});
                        return measure1 <= value && value <= measure2;
                    default:
                        return value === measure1;
                }
            default:
                return true;
        }
    }

    function matchItem(item) {
        const logPath = `${logRoot} » ${matchItem.name}(↓)`;
        logv(logPath, {item, noConstraints});
        return noConstraints ||
            Object.entries(constraints).every(constraint => matchField(item, constraint));
    }

    // function constrain(list) {
    //     return list.filter(matchItem);
    // }

    return {matchItem, mergeConstraints};
}
