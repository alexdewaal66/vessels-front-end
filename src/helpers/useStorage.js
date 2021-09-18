import { entitiesMetadata } from './entitiesMetadata';
import { useDict } from './useDict';
import { useMountEffect } from './customHooks';
import { remote } from './ormHelpers';
import { now, makeId } from './utils';
import { useState } from 'react';
import { RequestState } from './RequestState';

export const validities = {none: 0, id: 1, summary: 2, full: 3};

function transformAndStoreIdArray(data, tree) {
    const branches = Object.fromEntries(data.map(id =>
            [id, {
                item: {id},
                // valid: true,
                validity: validities.id,
            }]
        )
    );
    // console.log(`->-> branches=`, branches);
    tree.setMany(branches);
}

async function readAndStoreIds(metadata, requestState, tree) {
    await remote.readIds(
        metadata, requestState,
        (response) =>
            transformAndStoreIdArray(response.data, tree)
    );
}

async function readAndStoreAllIds(forest) {
    // console.log(`readAndStoreAllIds() forest.state=`, forest.state);
    const treeNames = Object.keys(forest);
    // const isFinished = Array(treeNames.length).fill(false);
    await Promise.all(
        treeNames.map(async (name, index) => {
                const requestState = new RequestState();
                await readAndStoreIds(entitiesMetadata[name], requestState, forest[name]);
            }
        )
    );
}

function transformAndStoreItemArray(metadata, data, tree) {
    const idKeyName = metadata.id;
    const branches = Object.fromEntries(data.map(item =>
            [item[idKeyName], {
                item,
                // valid: true,
                validity: validities.full,
            }]
        )
    );
    // console.log(`->-> branches=`, branches);
    tree.setMany(branches);
}

async function readAndStoreItemsByIds(metadata, idArray, requestState, tree) {
    await remote.readByIds(
        metadata, idArray, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree)
    )
}

async function readAndStoreItem(metadata, id, requestState, tree) {
    // const branch = tree.state[id];
    // console.log(`>>> readAndStoreItem(${metadata.name}, ${id}) tree=`, tree);
    if (!tree.state[id].item.valid) {
        await remote.read(
            metadata, id, requestState,
            (response) => {
                const item = response.data;
                tree.set(id, {
                    item, fetched: now(),
                    // valid: true,
                    validity: validities.full,
                });
                // console.log(`loadItem(${entityName}, ${id}) item=`, item);
            },
            () => {
                const current = tree.state[id];
                tree.set(id, {item: current.item, fetchFailed: now(), validity: validities.id});
            }
        );
    }
}

async function readAndStoreItemByUniqueFields(metadata, probe, requestState, tree, setResult) {
    let foundId = null;
    await remote.findByUniqueField(
        metadata, probe, requestState,
        (response) => {
            const item = response.data;
            tree.set(item.id, {
                item, fetched: now(),
                // valid: true,
                validity: validities.full,
            });
            foundId = item.id;
            // console.log(`readAndStoreItemByUniqueFields() foundId=`, foundId);
            setResult(foundId);
        },
        () => {
        }
    );
}

async function updateAndStoreItem(metadata, item, requestState, tree) {
    // const branch = tree.state[item.id];
    console.log(`>>> updateAndStoreItem(${metadata.name}, ${item.id}) tree=`, tree);
    if (tree.state[item.id]) {
        await remote.update(
            metadata, item, requestState,
            () => {
                tree.set(item.id, {
                    item, sent: now(),
                    // valid: true,
                    validity: validities.full,
                });
            },
            () => {
                tree.set(item.id, {
                    item, sendFailed: now(),
                    // valid: true,
                    validity: validities.full,
                });
            }
        );
    }
}

function extractNewId(message, label) {
    const parts = message.split(' ');
    return (parts[0] === label) ? parseInt(parts[1]) : null;
}

async function createAndStoreItem(metadata, item, requestState, tree) {
    // const branch = tree.state[item.id];
    console.log(`>>> createAndStoreItem(${metadata.name}, ${item.id}) tree=`, tree);
    if (!tree.state[item.id]) {
        await remote.create(
            metadata, item, requestState,
            (response) => {
                item.id = extractNewId(response.data, metadata.label);
                console.log(`created item.id=`, item.id);
                tree.add(item.id, {
                    item, sent: now(),
                    // valid: true,
                    validity: validities.full,
                });
            },
            () => {
                item.id = makeId();
                tree.set(item.id, {
                    item, createFailed: now(),
                    // valid: true,
                    validity: validities.full,
                });
            }
        );
    }
}

async function deleteAndStoreItem(metadata, id, requestState, tree) {
    // const branch = tree.state[item.id];
    console.log(`>>> deleteAndStoreItem(${metadata.name}, ${id}) tree=`, tree);
    if (tree.state[id]) {
        await remote.delete(
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

    const [allIdsLoaded, setAllIdsLoaded] = useState(null);
    useMountEffect(() => loadAllIds(() => setAllIdsLoaded(true)));

    // useMountEffect(() => readAndStoreAllIds(requestState, forest));

    function loadAllIds(setFinished) {
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle IDs `,
            advice: ''
        });
        readAndStoreAllIds(forest)
            .then(setFinished);
    }

    function getItem(entityName, id, propName) {
        const entry = forest[entityName].state[id];
        if (entry.valid) {
            const item = entry.item;
            return propName ? item[propName] : item;
        }
    }

    function loadDeferredItems(deferredLoads) {
        deferredLoads.forEach(entity => loadItem(entity.name, entity.id));
    }

    function loadItem(entityName, id, setFinished) {
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
        readAndStoreItem(entitiesMetadata[entityName], id, requestState, tree)
            .then(setFinished);
    }

    function loadItemsByIds(entityName, idArray, setFinished) {
        if (!(entityName in forest)) return;
        const tree = forest[entityName];
        const absentItemsIdArray = idArray.filter(id => !tree.state[id].item.valid);
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van ${absentItemsIdArray.length} ${entitiesMetadata[entityName].label} items `,
            advice: '',
            action: {type: 'loadItemsByIds', entityName},
        });
        readAndStoreItemsByIds(entitiesMetadata[entityName], absentItemsIdArray, requestState, tree)
            .then(setFinished);
    }

    function loadItemByUniqueFields(entityName, probe, setResult, setFinished) {
        // console.log(`loadItemByUniqueFields(${entityName}, probe) \nprobe=`, probe);
        const tree = forest[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het ophalen van de ${entitiesMetadata[entityName].label} match `,
            advice: '',
            action: {type: 'loadItemByUniqueFields', entityName, probe},
        });
        readAndStoreItemByUniqueFields(entitiesMetadata[entityName], probe, requestState, tree, setResult)
            .then(setFinished);
    }

    function saveItem(entityName, item, setFinished) {
        const id = item.id;
        console.log(`saveItem(${entityName}, ⬇) \n item=`, item);
        if (!forest[entityName]?.state[id]) {
            console.error(`id doesn't exist in storage:`, forest[entityName]?.state);
            return;
        }
        const tree = forest[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het bewaren van ${entitiesMetadata[entityName].label} (id=${id}) `,
            advice: '',
            action: {type: 'deleteItem', entityName, id},
        });
        updateAndStoreItem(entitiesMetadata[entityName], item, requestState, tree)
            .then(setFinished);
    }

    function newItem(entityName, item, setFinished) {
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
            advice: '',
            action: {type: 'newItem', entityName, id: 0},
        });
        createAndStoreItem(entitiesMetadata[entityName], item, requestState, tree)
            .then(setFinished);
    }

    function deleteItem(entityName, id, setFinished) {
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
            advice: '',
            action: {type: 'deleteItem', entityName, id},
        });
        deleteAndStoreItem(entitiesMetadata[entityName], id, requestState, tree)
            .then(setFinished);
    }

    return {
        allIdsLoaded,
        rsStatus,
        setRsStatus,
        store: forest,
        getItem,
        loadDeferredItems,
        loadItem,
        loadItemsByIds,
        saveItem,
        newItem,
        deleteItem,
        loadItemByUniqueFields
    };
}
