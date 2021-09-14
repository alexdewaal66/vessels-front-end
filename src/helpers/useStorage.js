import { entitiesMetadata } from './entitiesMetadata';
import { useDict } from './useDict';
import { useMountEffect } from './customHooks';
import { remote } from './ormHelpers';
import { now, makeId } from './utils';
import { useState } from 'react';
import { RequestState } from './RequestState';

function transformAndStoreIdArray(data, tree) {
    const branches = Object.fromEntries(data.map(
        id => [id, {item: null}]
        )
    );
    // console.log(`->-> branches=`, branches);
    tree.setMany(branches);
}

function readAndStoreIds(metadata, requestState, tree) {
    remote.readIds(
        metadata, requestState,
        (response) => transformAndStoreIdArray(response.data, tree)
    );
}

function readAndStoreAllIds(forest) {
    // console.log(`readAndStoreAllIds() forest.state=`, forest.state);
    Object.keys(forest).forEach(name => {
            const requestState = new RequestState();
            readAndStoreIds(entitiesMetadata[name], requestState, forest[name]);
        }
    );
}

function transformAndStoreItemArray(metadata, data, tree) {
    const idKeyName = metadata.id;
    const branches = Object.fromEntries(data.map(
        item => [item[idKeyName], {item}]
        )
    );
    // console.log(`->-> branches=`, branches);
    tree.setMany(branches);
}

function readAndStoreItemsByIds(metadata, idArray, requestState, tree) {
    remote.readByIds(
        metadata, idArray, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree)
    )
}

function readAndStoreItem(metadata, id, requestState, tree) {
    // const branch = tree.state[id];
    // console.log(`>>> readAndStoreItem(${metadata.name}, ${id}) tree=`, tree);
    if (!tree.state[id].item) {
        remote.read(
            metadata, id, requestState,
            (response) => {
                const item = response.data;
                tree.set(id, {item, fetched: now()});
                // console.log(`loadItem(${entityName}, ${id}) item=`, item);
            },
            () => {
                const current = tree.state[id];
                tree.set(id, {item: current.item, fetchFailed: now()});
            }
        );
    }
}

function readAndStoreItemByUniqueFields(metadata, probe, requestState, tree, setResult) {
    let foundId = null;
    remote.findByUniqueField(
        metadata, probe, requestState,
        (response) => {
            const item = response.data;
            tree.set(item.id, {item, fetched: now()});
            foundId = item.id;
            // console.log(`readAndStoreItemByUniqueFields() foundId=`, foundId);
            setResult(foundId);
        },
        () => {
        }
    );
}

function updateAndStoreItem(metadata, item, requestState, tree) {
    // const branch = tree.state[item.id];
    console.log(`>>> updateAndStoreItem(${metadata.name}, ${item.id}) tree=`, tree);
    if (tree.state[item.id]) {
        remote.update(
            metadata, item, requestState,
            () => {
                tree.set(item.id, {item, sent: now()});
            },
            () => {
                tree.set(item.id, {item, sendFailed: now()});
            }
        );
    }
}

function extractNewId(message, label) {
    const parts = message.split(' ');
    return (parts[0] === label) ? parseInt(parts[1]) : null;
}

function createAndStoreItem(metadata, item, requestState, tree) {
    // const branch = tree.state[item.id];
    console.log(`>>> createAndStoreItem(${metadata.name}, ${item.id}) tree=`, tree);
    if (!tree.state[item.id]) {
        remote.create(
            metadata, item, requestState,
            (response) => {
                item.id = extractNewId(response.data, metadata.label);
                console.log(`created item.id=`, item.id);
                tree.add(item.id, {item, sent: now()});
            },
            () => {
                item.id = makeId();
                tree.set(item.id, {item, createFailed: now()});
            }
        );
    }
}

function deleteAndStoreItem(metadata, id, requestState, tree) {
    // const branch = tree.state[item.id];
    console.log(`>>> deleteAndStoreItem(${metadata.name}, ${id}) tree=`, tree);
    if (tree.state[id]) {
        remote.delete(
            metadata, id, requestState,
            (response) => {
                console.log(`deleted id=`, id);
                tree.del(id);
            },
            () => {
                const current = tree.state['failedDeletions'];
                if (current) {
                    tree.set('failedDeletions', [...current, id]);
                } else {
                    tree.add('failedDeletions', [id]);
                }
                tree.del(id);
            }
        );
    }
}


export function useStorage() {
    // const [rsStatus, setRsStatus] = useContext(StatusContext);
    const [rsStatus, setRsStatus] = useState({
        requestState: null,
        description: '-nog geen beschrijving-',
        advice: '-nog geen advies-'
    });
    // console.log(`rsStatus=`, rsStatus);
    // console.log(`setRsStatus=`, setRsStatus);

    const forest = {
        // each entity gets its own dictionary to ease manipulation of props and minimize cloning
        xyz: useDict(),
        zyx: useDict(),
        vesselType: useDict(),
        country: useDict(),
        unLocode: useDict(),
        subdivision: useDict(),
        user: useDict(),
        // authority: useDict(),
    };
    // const {createRequestState} = useRequestStateDict();

    useMountEffect(() => readAndStoreAllIds(forest));

    // useMountEffect(() => readAndStoreAllIds(requestState, forest));


    function loadItem(entityName, id) {
        // console.log(`loadItem(${entityName}, ${id})`);
        if (!forest[entityName]?.state[id]) return;
        const tree = forest[entityName];
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van ${entitiesMetadata[entityName].label} (id=${id}) `,
            advice: ''
        });
        readAndStoreItem(entitiesMetadata[entityName], id, requestState, tree);
    }

    function loadItemsByIds(entityName, idArray) {
        if (!(entityName in forest)) return;
        const tree = forest[entityName];
        const absentItemsIdArray = idArray.filter(id => !tree.state[id].item);
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van ${absentItemsIdArray.length} ${entitiesMetadata[entityName].label} items `,
            advice: ''
        });
        readAndStoreItemsByIds(entitiesMetadata[entityName], absentItemsIdArray, requestState, tree);
    }

    function loadItemByUniqueFields(entityName, probe, setResult) {
        // console.log(`loadItemByUniqueFields(${entityName}, probe) \nprobe=`, probe);
        const tree = forest[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het ophalen van de ${entitiesMetadata[entityName].label} match `,
            advice: ''
        });
        readAndStoreItemByUniqueFields(entitiesMetadata[entityName], probe, requestState, tree, setResult);
    }

    function saveItem(entityName, item) {
        console.log(`saveItem(${entityName}, ⬇) \n item=`, item);
        if (!forest[entityName]?.state[item.id]) {
            console.error(`id doesn't exist in storage:`, forest[entityName]?.state);
            return;
        }
        const tree = forest[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het bewaren van ${entitiesMetadata[entityName].label} (id=${item.id}) `,
            advice: ''
        });
        updateAndStoreItem(entitiesMetadata[entityName], item, requestState, tree);
    }

    function newItem(entityName, item) {
        item.id = 0;
        console.log(`newItem(${entityName}, ⬇) \n item=`, item);
        if (forest[entityName]?.state[item.id]) {
            console.error(`id already exists in storage:`, forest[entityName]?.state);
            return;
        }
        const tree = forest[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het maken van een nieuwe ${entitiesMetadata[entityName].label} `,
            advice: ''
        });
        createAndStoreItem(entitiesMetadata[entityName], item, requestState, tree);
    }

    function deleteItem(entityName, id) {
        console.log(`deleteItem(${entityName}, ${id})`);
        if (!forest[entityName]?.state[id]) {
            console.error(`id doesn't exist in storage:`, forest[entityName]?.state);
            return;
        }
        const tree = forest[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het verwijderen van ${entitiesMetadata[entityName].label} (id=${id}) `,
            advice: ''
        });
        deleteAndStoreItem(entitiesMetadata[entityName], id, requestState, tree);
    }

    return {
        rsStatus,
        setRsStatus,
        store: forest,
        loadItem,
        loadItemsByIds,
        saveItem,
        newItem,
        deleteItem,
        loadItemByUniqueFields
    };
}
