import React, { useEffect, useState } from 'react';
import { cx } from '../helpers/multipleStyles';
import { useMountEffect, useRequestState } from '../helpers/customHooks';
import { Stringify } from './Stringify';
import { remote } from './ormHelpers';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { useDict } from '../helpers/useDict';

const entityNamesWithReadIds = ['xyz', 'zyx', 'vesselType', 'country', 'unLocode', 'subdivision'];

export function Empty({children, className, ...rest}) {
    const metadata = entitiesMetadata.vesselType;
    // const [example, setExample] = useState(initExample);
    const entityIds = useDict({});
    console.log(`entityIds=`, entityIds);
    const requestState = useRequestState();

    useMountEffect(loadAllIds);

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

    function loadIds(metadata) {
        remote.readIds(metadata, requestState,
            (response) => entityIds.add(metadata.name, response.data)
        );
    }

    function loadAllIds() {
        console.log(`loadAllIds() entityIds.dict=`, entityIds.dict);
        entityNamesWithReadIds.map(name =>
            loadIds(entitiesMetadata[name])
        )
    }

    return (
        <div className={cx('', className)} {...rest}>
            {children}
            <Stringify data={entityIds}>entityIds</Stringify>
        </div>
    );
}
