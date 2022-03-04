import { entityTypes } from './entityTypes';
import { useDict } from './useDict';
import { useMountEffect } from './customHooks';
import { remote } from './remote';
import { now, makeId } from './utils';
import { useState } from 'react';
import { RequestState } from './RequestState';
// import { logv, pathMkr, rootMkr } from '../dev/log';
import { useImmutableSet } from './useImmutableSet';
import { pathMkr, logv } from '../dev/log';

export const validities = {none: 0, id: 1, summary: 2, full: 3};

const initialTimestamps = {
    xyz: 0,
    zyx: 0,
    vesselType: 0,
    hull: 0,
    vessel: 0,
    country: 0,
    address: 0,
    unLocode: 0,
    subdivision: 0,
    user: 0,
    authority: 0,
    organisation: 0,
    relation: 0,
    relationType: 0,
    file: 0,
    image: 0,
};

const entityNames = Object.keys(initialTimestamps);

const logRoot = useStorage.name + '.js';

const idToEntry = id => [id, {
    item: {id},
    validity: validities.id,
}];

const idItemToEntry = idItem => [idItem.id, {
    item: idItem,
    validity: validities.id,
}];

// todo: use in all exported functions
function doNothing() {
}

function transformAndStoreIdArray(data, tree) {
    const entries = (typeof data[0] === 'number')
        ? data.map(idToEntry)
        : data.map(idItemToEntry);
    const branches = Object.fromEntries(entries);
    // logv(pathMkr(logRoot, transformAndStoreIdArray), {branches});
    tree.setMany(branches);
}

async function readAndStoreIds(entityType, requestState, tree) {
    await remote.readAllIds(
        entityType, requestState,
        (response) =>
            transformAndStoreIdArray(response.data, tree)
    );
}

async function readAndStoreAllIds(store) {
    // logv(pathMkr(logRoot, readAndStoreAllIds), {store});
    await Promise.all(
        entityNames.map(async name => {
                const requestState = new RequestState();
                await readAndStoreIds(entityTypes[name], requestState, store[name]);
            }
        )
    );
}

async function readAndStoreAllEntities(store) {
    // const logPath = pathMkr(logRoot, readAndStoreAllEntities);
    // logv( logPath, {store});
    await Promise.all(
        entityNames.map(async name => {
                const requestState = new RequestState();
                await readAndStoreAllItems(name, requestState, store);
            }
        )
    );
}

function transformAndStoreItemArray(entityName, data, store, validity) {
    const logPath = pathMkr(logRoot, transformAndStoreItemArray);
    const doLog = entityName === entityTypes.zyx.name;
    const idKey = entityTypes[entityName].id;
    let youngest = store.timestamps.state[entityName] || 0;
    const branches = Object.fromEntries(data.map(item => {
            youngest = Math.max(youngest, item.timestamp);
            return [item[idKey], {item, validity,}];
        })
    );
    if (doLog) logv(logPath, {youngest});
    store.timestamps.set(entityName, youngest);
    store[entityName].setMany(branches);
}

async function readAndStoreSummariesByIds(entityName, idArray, requestState, store) {
    await remote.readSummariesByIds(
        entityTypes[entityName], idArray, requestState,
        (response) => transformAndStoreItemArray(entityName, response.data, store, validities.summary)
    )
}

async function readAndStoreItemsByIds(entityName, idArray, requestState, store) {
    await remote.readItemsByIds(
        entityTypes[entityName], idArray, requestState,
        (response) => transformAndStoreItemArray(entityName, response.data, store, validities.full)
    )
}

async function readAndStoreAllSummaries(entityName, requestState, store) {
    await remote.readAllSummaries(
        entityTypes[entityName], requestState,
        (response) => transformAndStoreItemArray(entityName, response.data, store, validities.summary)
    )
}

async function readAndStoreAllItems(entityName, requestState, store) {
    if (!entityTypes[entityName]) logv(pathMkr(logRoot, readAndStoreAllItems), {entityName});
    await remote.readAllItems(
        entityTypes[entityName], requestState,
        (response) => transformAndStoreItemArray(entityName, response.data, store, validities.full)
    )
}


async function readAndStoreNewItems(entityName, requestState, store) {
    const logPath = pathMkr(logRoot, readAndStoreNewItems, entityName);
    const timestamp1 = store.timestamps.state[entityName];
    const timestamp2 = timestamp1 || 1640991600000; // 2022-01-01 00:00:00.000
    logv(logPath, {entityName, timestamp1, timestamp2, });
    await remote.readNewItems(
        entityTypes[entityName], timestamp2, requestState,
        (response) => transformAndStoreItemArray(entityName, response.data, store, validities.full)
    )
}


async function readAndStoreItem(entityName, id, requestState, store, onSuccess) {
    // const logPath = pathMkr(logRoot, readAndStoreItem, '↓↓');
    const tree = store[entityName];
    // logv(logPath, {entityName: entityType.name, id, tree});
    await remote.read(
        entityTypes[entityName], id, requestState,
        (response) => {
            const item = response.data;
            tree.set(id, {
                item, fetched: now(),
                validity: validities.full,
            });
            // logv(null, {item});
            onSuccess(item);
        },
        () => {
            const current = tree.state[id];
            tree.set(id, {...current, fetchFailed: now(), validity: validities.id});
        }
    );
}

async function readAndStoreItemByUniqueFields(entityName, probe, requestState, store, onSuccess) {
    let foundId = null;
    await remote.findByUniqueField(
        entityTypes[entityName], probe, requestState,
        (response) => {
            const item = response.data;
            store[entityName].set(item.id, {
                item, fetched: now(),
                // valid: true,
                validity: validities.full,
            });
            foundId = item.id;
            // logv(pathMkr(logRoot, readAndStoreItemByUniqueFields, entityType.name), {probe, item});
            onSuccess(foundId);
        },
        doNothing
    );
}

async function updateAndStoreItem(entityName, item, requestState, store, onSuccess) {
    // const logPath = pathMkr(logRoot, updateAndStoreItem, entityType.name, '↓↓');
    const tree = store[entityName];
    // logv(logPath, {item, tree});
    if (tree.state[item.id]) {
        await remote.update(
            entityTypes[entityName], item, requestState,
            () => {
                tree.set(item.id, {
                    item, success: now(),
                    validity: validities.full,
                });
                onSuccess(item);
            },
            () => {
                // tree.set(item.id, {
                //     item, fail: now(),
                //     // valid: true,
                //     validity: validities.full,
                // });
            }
        );
    }
}

function extractNewId(message, name) {
    // message is formed like 'Xyz 237 created'
    const parts = message.split(' ');
    return (parts[0].toLowerCase() === name.toLowerCase()) ? parseInt(parts[1]) : null;
}

// function extract

async function createAndStoreItem(entityType, item, requestState, tree) {
    const doLog = false;//|| entityType === entityTypes.vesselType ;//|| url.includes('images');
    const logPath = pathMkr(logRoot, createAndStoreItem, entityType.name, '↓↓');
    // const branch = tree.state[item.id];
    // logv(logPath, {item, tree});
    if (!tree.state[item.id]) {
        await remote.create(
            entityType, item, requestState,
            (response) => {
                if (doLog) logv(logPath, {item, response_data: response.data, entityName: entityType.name});
                item.id = extractNewId(response.data, entityType.name);
                if (doLog) logv(null, {item_id: item.id});
                if (entityType.needsReload) {
                    // logv(logPath + ' needsReload', {item})
                    tree.add(item.id, {
                        item, success: now(),
                        validity: validities.id,
                    });
                } else {
                    tree.add(item.id, {
                        item, success: now(),
                        validity: validities.full,
                    });
                }
            },
            () => {
                // item.id = makeId();
                // tree.set(item.id, {
                //     item, fail: now(),
                //     validity: validities.full,
                // });
            }
        );
    } else {
        console.error(`useStorage.js » createAndStoreItem()\n\t item.id=${item.id} already exists`);
    }
}

async function deleteAndStoreItem(entityType, id, requestState, tree) {
    // const logPath = pathMkr(logRoot, deleteAndStoreItem, entityType.name, '↓↓');
    // logv(logPath, {id, tree});
    if (tree.state[id]) {
        await remote.delete(
            entityType, id, requestState,
            () => {
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

/*************************************************************************************************/

export function useStorage() {
    // const logRoot = rootMkr(useStorage);
    const [rsStatus, setRsStatus] = useState({
        requestState: null,
        description: '-nog geen beschrijving-',
        advice: '-nog geen advies-'
    });

    const store = {
        // each entity gets its own dictionary to ease manipulation of props and to minimize impact of state changes
        xyz: useDict(),
        zyx: useDict(),
        vesselType: useDict(),
        hull: useDict(),
        vessel: useDict(),
        country: useDict(),
        address: useDict(),
        unLocode: useDict(),
        subdivision: useDict(),
        user: useDict(),
        authority: useDict(),
        organisation: useDict(),
        relation: useDict(),
        relationType: useDict(),
        file: useDict(),
        image: useDict(),
        timestamps: useDict(initialTimestamps),
    };

    // const deferredEntries = useImmutableSet();


    const [allLoaded, setAllLoaded] = useState(null);

    // useMountEffect(() => loadAllIds(() => setAllLoaded(true)));
    //
    // function loadAllIds(setFinished) {
    //     // const logPath = pathMkr(logRoot, loadAllIds);
    //     const requestState = new RequestState();
    //     // logv(logPath, requestState);
    //     setRsStatus({
    //         requestState,
    //         description: `het ophalen van alle IDs `,
    //         advice: ''
    //     });
    //     readAndStoreAllIds(store)
    //         .then(setFinished);
    // }

    useMountEffect(() => loadAllEntities(() => setAllLoaded(true)));

    function loadAllEntities(setFinished) {
        // const logPath = pathMkr(logRoot, loadAllIds);
        const requestState = new RequestState();
        // logv(logPath, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle gegevens `,
            advice: ''
        });
        readAndStoreAllEntities(store)
            .then(setFinished);
    }

    function getSummary(entityName, id) {
        return getItem(entityName, id, validities.summary);
    }


    function getItem(entityName, id, requiredValidity = validities.full) {
        const logPath = pathMkr(logRoot, getItem, entityName, id);
        const entry = store[entityName].state[id];
        // logv(logPath, {entry});
        if (entry?.validity >= requiredValidity) {
            return entry.item;
        } else {
            // mark entry in
            // deferredEntries.add(`${entityName}/${id}`);
            // logv('❌ ' + logPath, {entityName, id, entry, requiredValidity});
        }
    }

    // function loadDeferredItems(entityName) {
    //     [...deferredEntries].forEach(entry => {
    //         const [entryName, entryId] = entry.split('/');
    //         if (entryName === entityName)
    //             loadItem(entryName, +entryId, () => {
    //                 deferredEntries.del(entry)
    //             });// each load & each del is a state change
    //     });
    // }

    function loadItem(entityName, id, onSuccess) {
        // const logPath = pathMkr(logRoot, loadItem, entityName, id);
        // logv(logPath, {});
        // if (!storage.store[entityName]?.state[id]) return;//TODO onnodig/lastig/??
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het ophalen van ${entityTypes[entityName].label} (id=${id}) `,
            advice: '',
            // action: {type: loadItem.name, entityName},
        });
        readAndStoreItem(entityName, id, requestState, store, onSuccess)
            .then();
    }

    function loadSummariesByIds(entityName, idArray, onSuccess) {
        if (!(entityName in store)) return;
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van ${idArray.length} ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadItemsByIds.name, entityName},
        });
        readAndStoreSummariesByIds(entityName, idArray, requestState, store)
            .then(onSuccess);
    }

    function loadItemsByIds(entityName, idArray, onSuccess) {
        if (!(entityName in store)) return;
        const tree = store[entityName];
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van ${idArray.length} ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadItemsByIds.name, entityName},
        });
        readAndStoreItemsByIds(entityName, idArray, requestState, store)
            .then(onSuccess);
    }

    function loadAllSummaries(entityName, onSuccess) {
        if (!(entityName in store)) return;
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadAllSummaries.name, entityName},
        });
        readAndStoreAllSummaries(entityName, requestState, store)
            .then(onSuccess);
    }

    function loadAllItems(entityName, onSuccess) {
        if (!(entityName in store)) return;
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadAllItems.name, entityName},
        });
        readAndStoreAllItems(entityName, requestState, store)
            .then(onSuccess);
    }

    function loadChangedItems(entityName, onSuccess) {
        if (!(entityName in store)) return;
        const requestState = new RequestState();
        // logv(pathMkr(logRoot, loadChangedItems), {requestState});
        setRsStatus({
            requestState,
            description: `het ophalen van nieuwe ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadChangedItems.name, entityName},
        });
        readAndStoreNewItems(entityName, requestState, store)
            .then(onSuccess);
    }

    function loadItemByUniqueFields(entityName, probe, setResult, onSuccess) {
        // console.log(`loadItemByUniqueFields(${entityName}, probe) \nprobe=`, probe);
        const tree = store[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het ophalen van de ${entityTypes[entityName].label} match `,
            advice: '',
            // action: {type: loadItemByUniqueFields.name, entityName, probe},
        });
        readAndStoreItemByUniqueFields(entityName, probe, requestState, store, setResult)
            .then(onSuccess);
    }

    function saveItem(entityName, item, onSuccess) {
        // const logPath = pathMkr(logRoot, saveItem, entityName, '↓');
        // logv(logPath, {item});
        const id = item.id;
        if (!store[entityName]?.state[id]) {
            console.error(`id doesn't exist in storage:`, store[entityName]?.state);
            return;
        }
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het bewaren van ${entityTypes[entityName].label} (id=${id}) `,
            advice: '',
            // action: {type: saveItem.name, entityName, id},
        });
        updateAndStoreItem(entityName, item, requestState, store, onSuccess).then();
    }


    function newItem(entityName, item,
                     onSuccess = doNothing, onFail = doNothing) {
        // const logPath = pathMkr(logRoot, newItem, entityName, '↓');
        // logv(logPath, {item});
        item.id = -1;// prevent collision in store
        const tree = store[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het maken van een nieuwe ${entityTypes[entityName].label} `,
            advice: '',
            // action: {type: newItem.name, entityName, id: 0},
        });
        createAndStoreItem(entityTypes[entityName], item, requestState, tree)
            .then(
                () => onSuccess(item),
                () => onFail()
            );
    }

    function deleteItem(entityName, id, onSuccess) {
        // const logPath = pathMkr(logRoot, deleteItem, entityName, '↓');
        // logv(logPath, {id});
        if (!store[entityName]?.state[id]) {
            console.error(`id doesn't exist in storage:`, store[entityName]?.state);
            return;
        }
        const tree = store[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het verwijderen van ${entityTypes[entityName].label} (id=${id}) `,
            advice: '',
            // action: {type: deleteItem.name, entityName, id},
        });
        deleteAndStoreItem(entityTypes[entityName], id, requestState, tree)
            .then(onSuccess);
    }


    return {
        allIdsLoaded: allLoaded,
        rsStatus, setRsStatus,
        store,
        getItem, getSummary,
        loadItem,
        loadItemsByIds,
        loadAllItems,
        loadChangedItems,
        loadSummariesByIds,
        saveItem,
        newItem,
        deleteItem,
        loadItemByUniqueFields
    };
}

