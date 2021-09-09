import React, { useEffect, useState } from 'react';
import { cx } from '../helpers/multipleStyles';
import { useMountEffect, useRequestState } from '../helpers/customHooks';
import { Stringify } from './Stringify';
import { remote } from './ormHelpers';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { useDict, useSuperDict } from '../helpers/useDict';
import { useStorage } from '../helpers/useStorage';
import { get } from 'react-hook-form';


export function Test({children, className, ...rest}) {
    const {store, getItem, getItemsByIds} = useStorage();
    const {createEntry, entries} = useSuperDict();
    const key = '12345';

    // function createEntry(dict, key, initialValue) {
    //     dict.add(key, {
    //         value: initialValue,
    //         set: (v) =>  testDict.set(key, {...testDict.get(key), value: v})
    //     });
    // }

    useMountEffect( () => {
        createEntry(key, 'allereerste');
    });

    function updateTestDict() {
        entries[key].set({pi: 3.1415926, onzin: 'vuhbqeuvbvuhbvuebv'});
    }

    const loadFirstItem = (entityName) => () => {
        // only do first item
        const id = Object.keys(store[entityName].state)[0];
        getItem(entityName, id);
    };

    const loadFirst100Item = (entityName) => () => {
        // only do first 100 items
        const idArray = Object.keys(store[entityName].state);
        const firstBunch = idArray.slice(0,100);
        // firstBunch.forEach( id => getItem(entityName, id) );
        getItemsByIds(entityName, firstBunch);
    };

    return (
        <>
            <div className={cx('', className)} {...rest}>
                <button onClick={updateTestDict}>updateTestDict</button>
                <Stringify data={entries[key]} >testEntries[{key}]</Stringify>
                {Object.keys(store).map(entityName =>
                    <React.Fragment key={entityName}>
                        <button onClick={loadFirstItem(entityName)}>Laad eerste {entityName}</button>
                        <button onClick={loadFirst100Item(entityName)}>Laad eerste 100 {entityName}s</button>
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

