import { useState } from 'react';
import { createEmptySummary, types } from '../../helpers';

export function useFilters(metadata) {
    // const logRoot = rootMkr(useFilters, metadata.name);
    const [constraints, setConstraints] = useState(createEmptySummary(metadata));
    const [noConstraints, setNoConstraints] = useState(true);

    const matchers = {
        str: (itemValue, filterValue) => {
            return itemValue.toLowerCase().includes(filterValue);
        },
        num: (itemValue, filterValue) => {
            return filterValue.lo <= itemValue && itemValue <= filterValue.hi;
        },
        always: () => {
            return true;
        }
    };

    function preprocess(constraints) {
        Object.entries(constraints).forEach(([fieldName, filterValue]) => {
            if (filterValue) {
                let newFilter = {};
                switch (metadata.properties[fieldName].type) {
                    case types.str:
                        newFilter.matcher = matchers.str;
                        newFilter.value = filterValue.toLowerCase();
                        break;
                    case types.num:
                        const [lo, hi] = filterValue.split('-');
                        newFilter.matcher = matchers.num;
                        newFilter.value = {
                            lo: (!lo) ? -Infinity : +lo,
                            hi: (!hi) ? +Infinity : +hi
                        };
                        break;
                    default:
                        newFilter.matcher = matchers.always;
                }
                constraints[fieldName] = newFilter;
            }
        });
    }

    function mergeConstraints(updatedConstraints) {
        // const logPath = pathMkr(logRoot, mergeConstraints);
        preprocess(updatedConstraints);
        setConstraints(currentConstraints => {
                const newConstraints = {...currentConstraints, ...updatedConstraints};
                const allEmpty = Object.values(newConstraints).every(constraint => !constraint);
                setNoConstraints(allEmpty);
                // logv(logPath, {newValues: newConstraints, allEmpty});
                return newConstraints;
            }
        );
    }

    function matchField(item, constraint) {
        // const logPath = pathMkr(logRoot, matchField, '(↓↓)');
        // logv(logPath, {item, constraint});
        const [fieldName, filter] = constraint;
        if (!filter) return true;
        if (!item[fieldName]) return true;
        return filter.matcher(item[fieldName], filter.value);
    }

    function matchItem(item) {
        // const logPath = pathMkr(logRoot, matchItem, '(↓)');
        // logv(logPath, {item, noConstraints});
        return noConstraints ||
            Object.entries(constraints).every(constraint => matchField(item, constraint));
    }

    // function constrain(list) {
    //     return list.filter(matchItem);
    // }

    return {matchItem, mergeConstraints};
}
