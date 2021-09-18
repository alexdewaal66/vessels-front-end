import React, { useContext } from 'react';
import { cx } from '../helpers/multipleStyles';
import { useMountEffect } from '../helpers/customHooks';
import { Stringify } from './Stringify';
import { useSuperDict } from '../helpers/useDict';
import { OrmContext } from '../contexts/OrmContext';
import { ShowRequestState } from '../components';


export function Test({children, className, ...rest}) {
    const {allIdsLoaded, rsStatus, setRsStatus, store, loadItem, loadItemsByIds, saveItem, newItem, deleteItem}
        = useContext(OrmContext);
    const {createEntry, entries} = useSuperDict();
    const testKey = '12345';
    const testXyz1 = {
        id:4,
        name: 'testXyz1',
        xyzString: 'test-test-test',
        description: 'testXyz1-testXyz1-testXyz1-testXyz1-testXyz1',
        ratio: 123456789,
        zyx: null,
    }
    const testXyz2 = {
        id:5,
        name: 'testXyz2',
        xyzString: 'test-test-test',
        description: 'testXyz2-testXyz2-testXyz2-testXyz2-testXyz2',
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
        const id = Object.keys(store[entityName].state)[0];
        loadItem(entityName, id);
    };

    const loadFirst100Items = (entityName) => () => {
        const idArray = Object.keys(store[entityName].state);
        const firstBunch = idArray.slice(0,100);
        loadItemsByIds(entityName, firstBunch);
    };

    function saveTestXyz() {
        console.log('saveTestXyz');
        saveItem('xyz', testXyz1);
    }

    function createTestXyz() {
        console.log('saveTestXyz');
        newItem('xyz', testXyz2);
    }

    function deleteTestXyz(e) {
        e.preventDefault();
        const id = e.target.id.value;
        console.log('deleteTestXyz id=', id);
        deleteItem('xyz', id);
    }

    function testSetStatus() {
        setRsStatus({
            pietje: 'Puk',
            getal: 123.456
        });
    }

    return (
        <>
            <Stringify data={allIdsLoaded} >
                allIdsLoaded
            </Stringify>
            <Stringify data={rsStatus}>
                status
            </Stringify>

            {rsStatus && (
                <ShowRequestState {...rsStatus} />
            )}
            <div className={cx('', className)} {...rest}>
                <button onClick={testSetStatus}>testSetStatus</button>
                <button onClick={saveTestXyz}>saveTestXyz</button>
                <button onClick={createTestXyz}>createTestXyz</button>
                <form onSubmit={deleteTestXyz}>
                    <input name="id" placeholder="id"/>
                    <button type={'submit'}>deleteTestXyz</button>
                </form>
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

/*****************************
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
 */