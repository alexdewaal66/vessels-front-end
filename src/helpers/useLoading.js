import { useMountEffect } from './customHooks';
import React, { useEffect, useState } from 'react';
import { useInterval } from './useInterval';

const LOAD_CHANGED_ITEMS_INTERVAL = 30_000;// milliseconds

export function useLoading(storage, entityName) {

    // const [intervalCounter, setIntervalCounter] = useState(0);


    // this version does not read the updated state
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         storage.loadNewItems(entityName, onSuccess);
    //         setIntervalCounter(current => current + 1);
    //     }, LOAD_CHANGED_ITEMS_INTERVAL);
    //     return () => clearInterval(interval);
    // }, []);

    useInterval(() => {
        storage.loadChangedItems(entityName, onSuccess);
        // setIntervalCounter(current => current + 1);
    }, LOAD_CHANGED_ITEMS_INTERVAL);

    function onSuccess() {
    }

    // return intervalCounter;
}