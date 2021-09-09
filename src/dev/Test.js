import React, { useContext, useEffect, useState } from 'react';
import { cx } from '../helpers/multipleStyles';
import { useMountEffect, useRequestState } from '../helpers/customHooks';
import { Stringify } from './Stringify';
import { useDict, useSuperDict } from '../helpers/useDict';
import { useStorage } from '../helpers/useStorage';
import { OrmContext } from './OrmContext';


export function Test({children, className, ...rest}) {
    // const {store, getItem, getItemsByIds} = useStorage();
    const { storage } = useContext(OrmContext);
    const {store, getItem, getItemsByIds, saveItem} = storage;
    const {createEntry, entries} = useSuperDict();
    const testKey = '12345';
    const testXyz = {
        id:5,
        name: 'testXyz',
        xyzString: 'test-test-test',
        description: 'testXyz-testXyz-testXyz-testXyz-testXyz',
        ratio: 123456789,
        zyx: null,
    }

    useMountEffect( () => {
        createEntry(testKey, 'allereerste');
    });

    function updateTestDict() {
        entries[testKey].set({pi: 3.1415926, onzin: 'vuhbqeuvbvuhbvuebv'});
    }

    const loadFirstItem = (entityName) => () => {
        // only do first item
        const id = Object.keys(store[entityName].state)[0];
        getItem(entityName, id);
    };

    const loadFirst100Items = (entityName) => () => {
        // only do first 100 items
        const idArray = Object.keys(store[entityName].state);
        const firstBunch = idArray.slice(0,100);
        // firstBunch.forEach( id => getItem(entityName, id) );
        getItemsByIds(entityName, firstBunch);
    };

    function saveTestXyz() {
        console.log('saveTestXyz');
        saveItem('xyz', testXyz);
    }

    return (
        <>
            <div className={cx('', className)} {...rest}>
                <button onClick={saveTestXyz}>saveTestXyz</button>
                <button onClick={updateTestDict}>updateTestDict</button>
                <Stringify data={entries[testKey]} >testEntries[{testKey}]</Stringify>
                {Object.keys(store).map(entityName =>
                    <React.Fragment key={entityName}>
                        <button onClick={loadFirstItem(entityName)}>Laad eerste {entityName}</button>
                        <button onClick={loadFirst100Items(entityName)}>Laad eerste 100 {entityName}s</button>
                        <Stringify data={store[entityName].state}>
                            {entityName}
                        </Stringify>
                    </React.Fragment>
                )}
            </div>
        </>
    );
}

// function initExample() {
//     return function () {
//         console.log('example useState initializer');
//         return 0;
//     };
// }
//
// const cleanupExample1 = () => {
//     console.log('example useEffect cleanup named');
// };
//
// const callBackExample1 = () => {
//     console.log('example useEffect callback #1');
//     return cleanupExample1;
// };
//
// useEffect(callBackExample1, []);
//
// const callBackExample2 = () => {
//     console.log('example useEffect callback #2');
//     return () => {
//         console.log('example useEffect cleanup inline');
//     };
// };
//
// useEffect(callBackExample2, []);

