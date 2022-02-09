import React, { useContext, useMemo } from 'react';
import { useMountEffect, useSuperDict, transform, cx, now } from '../helpers';
import { Stringify } from './Stringify';
import { StorageContext } from '../contexts/StorageContext';
import { ShowRequestState } from '../components';
import { ShowObject } from './ShowObject';
import { useSet } from '../helpers/useSet';
import { logv } from './log';
// import { TestMountDismountContext } from './TestMountDismountContext';

export function Test({children, className, ...rest}) {
    const logRoot  = Test.name;
    const {allIdsLoaded, rsStatus, setRsStatus, store, loadItem, loadItemsByIds, saveItem, newItem, deleteItem}
        = useContext(StorageContext);
    const {createEntry, entries} = useSuperDict();
    const primesSet = useSet([1,2,3,5,7,11,13,15]);
    logv(logRoot, {primes: primesSet});

    const testKey = '12345';
    const testXyz1 = {
        id: -4,
        name: 'testXyz1',
        xyzString: 'test-test-test',
        description: 'testXyz1-testXyz1-testXyz1-testXyz1-testXyz1',
        ratio: 123456789,
        zyx: null,
    }
    const testXyz2 = {
        id: -5,
        name: 'testXyz2',
        xyzString: 'test-test-test',
        description: 'testXyz2-testXyz2-testXyz2-testXyz2-testXyz2',
        ratio: 123456789,
        zyx: null,
    }

    // const {useTestMountDismount} = useContext(TestMountDismountContext);

    // useTestMountDismount();

    useMountEffect(() => {
        createEntry(testKey, 'allereerste');
    });

    function add17toPrimesSet() {
        primesSet.add(17);
    }

    function del15fromPrimesSet() {
        primesSet.del(15);
    }

    function reversePrimesSetIf17Present() {
        if (primesSet.has(17)) {
            const primesArray = [...primesSet.all];
            primesArray.sort((a,b) => b - a);
            primesSet.new(primesArray);
        }
    }

    function sortPrimesSetIf15NotPresent() {
        if (!primesSet.has(15)) {
            primesSet.new(pr => [...pr].sort((a, b) => a-b));
        }
    }

    function updateTestDict() {
        entries[testKey].set({pi: 3.1415926, onzin: 'vuhbqeuvbvuhbvuebv'});
    }

    const loadFirstItem = (entityName) => () => {
        const id = Object.keys(store[entityName].state)[0];
        loadItem(entityName, id);
    };

    const loadFirst100Items = (entityName) => () => {
        const idArray = Object.keys(store[entityName].state);
        const firstBunch = idArray.slice(0, 100);
        loadItemsByIds(entityName, firstBunch);
    };

    function saveTestXyz() {
        console.log('saveTestXyz');
        saveItem('xyz', testXyz1);
    }

    function createTestXyz() {
        console.log(now() + 'Test » createTestXyz() \n\t testXyz2=', testXyz2);
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

            <Stringify data={[...primesSet.all]}>
                priemgetallen
            </Stringify>
            <button onClick={add17toPrimesSet}>voeg 17 toe</button>
            <button onClick={del15fromPrimesSet}>haal 15 weg</button>
            <button onClick={reversePrimesSetIf17Present}>sorteer omlaag als 17 er is</button>
            <button onClick={sortPrimesSetIf15NotPresent}>sorteer als geen 15</button>
            <p>{'= < > ∼ ≈ ≠'}</p>
            <ShowObject data={
                useMemo(() =>
                        transform('unLocode', 'functionClassifier', '1-345---'),
                    []
                )
            }/>
            <Stringify data={allIdsLoaded}>
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
                <Stringify data={entries[testKey]}>testEntries[{testKey}]</Stringify>
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
function initExample() {
    return function () {
        console.log('example useState initializer');
        return 0;
    };
}

const cleanupExample1 = () => {
    console.log('example useEffect cleanup named');
};

const callBackExample1 = () => {
    console.log('example useEffect callback #1');
    return cleanupExample1;
};

useEffect(callBackExample1, []);

const callBackExample2 = () => {
    console.log('example useEffect callback #2');
    return () => {
        console.log('example useEffect cleanup inline');
    };
};

useEffect(callBackExample2, []);
* * * * * * * * * * * * * * * * * * * * * * * * * */
// const queryOperators = [
//     '==', '!=', '>', '>=', '<', '<=',
//     // numeric: approximation, delta, range
//     '≈', '±', '..',
//     // string: startsWith, endsWith, contains
//     '~%', '%~', '%~%'
//
// ];
//
// const xyzQuery = {
//     probe: {
//         name: 'era',
//         xyzString: 'vacuum',
//         ratio: 13.5,
//         zyx: {id: 3}
//     },
//     operator: {
//         name: 'contains',
//         xyzString: 'contains',
//         ratio: '<=',
//         zyx: '='
//     },
//     match: 'any'
// };
