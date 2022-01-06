import { useState } from 'react';
import { compare, useConditionalEffect } from '../../helpers';
import { logv } from '../../dev/log';

export function useSorting(operation, list) {
    const logRoot = `${useSorting.name}()`;
    const [sorting, setSorting] = useState({propertyName: 'id', order: 'up'});

    useConditionalEffect(
        () => operation([...list]),
        !!sorting && !!list,
        [sorting]
    );

    const sortList = {
        up: function (list) {
            list.sort((a, b) => compare(a[sorting.propertyName], b[sorting.propertyName]))
        },
        down: function (list) {
            list.sort((a, b) => compare(b[sorting.propertyName], a[sorting.propertyName]))
        },
    };

    function sort(list) {
        sortList[sorting.order](list);
    }

    return {sort, setSorting};
}