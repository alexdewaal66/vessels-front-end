import { useState } from 'react';
import { loCaseCompare, useConditionalEffect } from '../../helpers';
import { useSpinner } from '../../helpers/useSpinner';
import { dotCount } from '../../helpers/utils';
import { logv, pathMkr, rootMkr } from '../../dev/log';

function initialOrder(entityType) {
    return Object.fromEntries(entityType.summary.map(fieldPath => [fieldPath, 'up']));
}

export function useSorting(operation, list, entityType) {
    const logRoot = rootMkr(useSorting);
    const [latest, setLatest] = useState({propertyName: 'id', order: 'up'});
    const [allOrders, setAllOrders] = useState(initialOrder(entityType));
    // const allOrders = useStaticObject(initialOrder(entityType));
    const spinner = useSpinner();

    function setOrder(newSorting) {
        spinner.wait();
        setLatest(newSorting);
        setAllOrders(prevState => ({...prevState, [newSorting.propertyName]: newSorting.order}))
        // allOrders[newSorting.propertyName] = newSorting.order;
    }

    function isOrderUp(propertyName) {
        return allOrders[propertyName] === 'up';
        // return allOrders[propertyName] === 'up';
    }

    useConditionalEffect(
        () => operation([...list]),
        !!latest && !!list,
        [latest]
    );


    function makeGetProp() {
        const logPath = pathMkr(logRoot, makeGetProp);
        const dots = dotCount(latest.propertyName);
        logv(logPath, {latest_propertyName: latest.propertyName, dots})
        if (dots === 0) {
            return (x) => x[latest.propertyName];
        } else {
            const parts = latest.propertyName.split('.');
            logv(null, {parts});
            return (x) => x[parts[0]]?.[parts[1]];
        }
    }

    const sortList = {
        up: function (list) {
            const getProp = makeGetProp();
            list.sort((a, b) => loCaseCompare(getProp(a), getProp(b), latest.fieldType));
            spinner.clear();
        },
        down: function (list) {
            const getProp = makeGetProp();
            list.sort((a, b) => loCaseCompare(getProp(b), getProp(a), latest.fieldType));
            spinner.clear();
        },
    };

    function sort(list) {
        sortList[latest.order](list);
    }

    return {sort, isOrderUp, setOrder};
}