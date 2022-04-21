import { useState } from 'react';
import { loCaseCompare, useConditionalEffect } from '../../helpers';
import { useSpinner } from '../../helpers/useSpinner';

function initialOrder(entityType) {
    return Object.fromEntries(entityType.summary.map(propertyName => [propertyName, 'up']));
}

export function useSorting(operation, list, entityType) {
    // const logRoot = rootMkr(useSorting);
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

    const sortList = {
        up: function (list) {
            list.sort((a, b) => loCaseCompare(a[latest.propertyName], b[latest.propertyName]));
            spinner.clear();
        },
        down: function (list) {
            list.sort((a, b) => loCaseCompare(b[latest.propertyName], a[latest.propertyName]))
            spinner.clear();
        },
    };

    function sort(list) {
        sortList[latest.order](list);
    }

    return {sort, isOrderUp, setOrder};
}