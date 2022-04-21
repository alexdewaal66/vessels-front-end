import React from 'react';
import { useMountEffect, useDict, useRequestState, remote, entityTypes, cx} from '../../helpers';
import { Stringify } from '../Stringify';

const entityNamesWithReadIds = ['xyz', 'zyx', 'vesselType', 'country', 'unLocode', 'subdivision'];

export function Empty({children, className, ...rest}) {
    const entityIds = useDict({});
    const entityButtonsDisabled = useDict({});
    console.log(`entityIds=`, entityIds);
    const requestState = useRequestState();

    function initEntityButtons() {
        entityNamesWithReadIds.forEach(name =>
            entityButtonsDisabled.add(name, false)
        );
    }


    useMountEffect(initEntityButtons);


    function loadIds(entityType) {
        return () => {
            remote.readAllIds(entityType, requestState,
                (response) => entityIds.add(entityType.name, response.data));
            entityButtonsDisabled.set(entityType.name, true);
        }
    }

    return (
        <div className={cx('', className)} {...rest}>
            {children}
            <Stringify data={entityIds}>entityIds</Stringify>
            <Stringify data={entityButtonsDisabled}>entityButtonsDisabled</Stringify>
            {entityNamesWithReadIds.map(name =>
                <>
                    <button onClick={loadIds(entityTypes[name])}
                            key={'button_load_ids_' + name}
                            id={'button_load_ids_' + name}
                            disabled={entityButtonsDisabled.state[name]}
                    >
                        Laad {entityTypes[name].label} ID's
                    </button>
                </>
            )}
            {/*<button onClick={loadIds(entityType)}>Laad {entityType.label} ID's</button>*/}
        </div>
    );
}

// const [example, setExample] = useState(initExample);

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
