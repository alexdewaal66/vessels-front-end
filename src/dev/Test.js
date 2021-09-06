import React, { useEffect, useState } from 'react';
import { cx } from '../helpers/multipleStyles';
import { useMountEffect, useRequestState } from '../helpers/customHooks';
import { Stringify } from './Stringify';
import { remote } from './ormHelpers';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { useDict } from '../helpers/useDict';
import { useStorage } from '../helpers/useStorage';


export function Test({children, className, ...rest}) {
    const {store, getItem, getItemsByIds} = useStorage();

    const loadItems = (entityName) => () => {
        // only do first 100 items
        const idArray = Object.keys(store[entityName].dict);
        const firstBunch = idArray.slice(0,100);
        // firstBunch.forEach( id => getItem(entityName, id) );
        getItemsByIds(entityName, firstBunch);
    };

    return (
        <>
            <div className={cx('', className)} {...rest}>
                {Object.keys(store).map(entityName =>
                    <React.Fragment key={entityName}>
                        <button onClick={loadItems(entityName)}>Laad {entityName}s</button>
                        <Stringify data={store[entityName].dict}>
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

