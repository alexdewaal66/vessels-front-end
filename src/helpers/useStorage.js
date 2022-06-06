import { entityNameList, entityTypes } from './entityTypes';
import { now, remote, RequestState, useDict, useMountEffect } from './';
import { useState } from 'react';
import { logv, pathMkr } from '../dev/log';


export const validities = {none: 0, id: 1, summary: 2, full: 3};

const initialTimestamps = Object.fromEntries(entityNameList.map(name => [name, 0]));

const logRoot = useStorage.name + '.js';

// const idToEntry = id => [id, {
//     item: {id},
//     validity: validities.id,
// }];

// const idItemToEntry = idItem => [idItem.id, {
//     item: idItem,
//     validity: validities.id,
// }];

// function transformAndStoreIdArray(data, tree) {
//     const entries = (typeof data[0] === 'number')
//         ? data.map(idToEntry)
//         : data.map(idItemToEntry);
//     const branches = Object.fromEntries(entries);
//     // logv(pathMkr(logRoot, transformAndStoreIdArray), {branches});
//     tree.setMany(branches);
// }

// async function readAndStoreIds(entityType, requestState, tree) {
//     await remote.readAllIds(
//         entityType, requestState,
//         (response) =>
//             transformAndStoreIdArray(response.data, tree)
//     );
// }

// async function readAndStoreAllIds(store) {
//     // logv(pathMkr(logRoot, readAndStoreAllIds), {store});
//     await Promise.all(
//         entityNameList.map(async name => {
//                 const requestState = new RequestState();
//                 await readAndStoreIds(entityTypes[name], requestState, store[name]);
//             }
//         )
//     );
// }

async function readAndStoreAllEntities(store, onSucces, onFail) {
    // const logPath = pathMkr(logRoot, readAndStoreAllEntities);
    // logv( logPath, {store});
    await Promise.all(
        entityNameList.map(async name => {
            if (entityTypes[name].hasBulkLoading)
                {
                    const requestState = new RequestState();
                    await readAndStoreAllItems(name, requestState, store, onSucces, onFail);
                }
            }
        )
    );
}

function transformAndStoreItemArray(entityName, data, store, validity) {
    // const logPath = pathMkr(logRoot, transformAndStoreItemArray);
    // const doLog = entityName === entityTypes.zyx.name;
    const idKey = entityTypes[entityName].id;
    let youngest = store.timestamps.state[entityName] || 0;
    const branches = Object.fromEntries(data.map(item => {
            youngest = Math.max(youngest, item.timestamp);
            return [item[idKey], {item, validity,}];
        })
    );
    // if (doLog) logv(logPath, {youngest});
    store.timestamps.set(entityName, youngest);
    store[entityName].setMany(branches);
}

//////////////////////////////////////////////////////////////////////////////////////
function transformAndRemoveDeletionArray(entityName, deletions, store) {
    const logPath = pathMkr(logRoot, transformAndRemoveDeletionArray);
    // const doLog = entityName === entityTypes.xyz.name;
    logv(logPath, {entityName, data: deletions});
    let youngest = store.timestamps.state[entityName] || 0;
    const idList = deletions.map(item => {
            youngest = Math.max(youngest, item.timestamp);
            return item['itemId'];
        });
    logv(null, {idList});
    store[entityName].delMany(idList);
}
////////////////////////////////////////////////////////////////////////////////////

// async function readAndStoreSummariesByIds(entityName, idArray, requestState, store, onSuccess, onFail) {
//     await remote.readSummariesByIds(
//         entityTypes[entityName], idArray, requestState,
//         (response) => {
//             transformAndStoreItemArray(entityName, response.data, store, validities.summary);
//             onSuccess?.(response);
//         },
//         onFail
//     )
// }

async function readAndStoreItemsByIds(entityName, idArray, requestState, store, onSuccess, onFail) {
    await remote.readItemsByIds(
        entityTypes[entityName], idArray, requestState,
        (response) => {
            transformAndStoreItemArray(entityName, response.data, store, validities.full);
            onSuccess?.(response);
        },
        onFail
    )
}

// async function readAndStoreAllSummaries(entityName, requestState, store, onSuccess, onFail) {
//     await remote.readAllSummaries(
//         entityTypes[entityName], requestState,
//         (response) => {
//             transformAndStoreItemArray(entityName, response.data, store, validities.summary);
//             onSuccess?.(response);
//         },
//         onFail
//     )
// }

async function readAndStoreAllItems(entityName, requestState, store, onSuccess, onFail) {
    if (!entityTypes[entityName]) logv(pathMkr(logRoot, readAndStoreAllItems), {entityName});
    await remote.readAllItems(
        entityTypes[entityName], requestState,
        (response) => {
            transformAndStoreItemArray(entityName, response.data, store, validities.full);
            onSuccess?.(response);
        },
        onFail
    )
}


async function readAndStoreChangedItems(entityName, requestState, store, onSuccess, onFail) {
    const logPath = pathMkr(logRoot, readAndStoreChangedItems, entityName);
    const timestamp1 = store.timestamps.state[entityName];
    const timestamp2 = timestamp1 || 1640995200000; // 2022-01-01 00:00:00.000
    // logv(logPath, {entityName, timestamp1, timestamp2,});
    await remote.readChangedItems(
        entityTypes[entityName], timestamp2, requestState,
        (response) => {
            logv(logPath, {response_data:response.data});
            transformAndStoreItemArray(entityName, response.data.fresh, store, validities.full);
            transformAndRemoveDeletionArray(entityName, response.data.deletions, store);
            onSuccess?.(response);
        },
        onFail
    )
}


async function readAndStoreItem(entityName, id, requestState, store, onSuccess, onFail) {
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
            onSuccess?.(item);
        },
        (error) => {
            const current = tree.state[id];
            tree.set(id, {...current, fetchFailed: now(), validity: validities.id});
            onFail?.(error);
        }
    );
}

async function readAndStoreItemByUniqueFields(entityName, probe, requestState, store, onSuccess, onFail) {
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
            logv(pathMkr(logRoot, readAndStoreItemByUniqueFields, entityName), {probe, item});
            onSuccess?.(foundId);
        },
        onFail
    );
}

async function updateAndStoreItem(entityName, item, requestState, store, onSuccess, onFail) {
    // const logPath = pathMkr(logRoot, updateAndStoreItem, entityType.name, '↓↓');
    const tree = store[entityName];
    // logv(logPath, {item, tree});
    if (tree.state[item.id]) {
        await remote.update(
            entityTypes[entityName], item, requestState,
            (response) => {
                tree.set(item.id, {
                    item, success: now(),
                    validity: validities.full,
                });
                onSuccess?.(response.data);
            },
            onFail
        );
    }
}

function extractNewId(message, name) {
    // message is formed like 'Xyz 237 created'
    const parts = message.split(' ');
    if (parts[0].toLowerCase() === name.toLowerCase())
        return parseInt(parts[1])
    else {
        logv(pathMkr(logRoot, extractNewId), {message, name}, 'conflicting names');
        return null;
    }
}


async function createAndStoreItem(entityName, item, requestState, store, onSuccess, onFail) {
    const doLog = false;//|| entityType === entityTypes.vesselType ;//|| url.includes('images');
    const logPath = pathMkr(logRoot, createAndStoreItem, entityName, '↓↓');
    // const branch = tree.state[item.id];
    // logv(logPath, {item, tree});
    const tree = store[entityName];
    if (!tree.state[item.id]) {
        await remote.create(
            entityTypes[entityName], item, requestState,
            (response) => {
                if (doLog) logv(logPath, {item, response_data: response.data, entityName});
                item.id = extractNewId(response.data, entityName);
                if (doLog) logv(null, {item_id: item.id});
                if (entityTypes[entityName].needsReload) {
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
                onSuccess?.(item);
            },
            onFail
        );
    } else {
        const prompt = 'id already exists: ';
        onFail?.(prompt + item.id);
        logv(logPath, {item_id: item.id}, prompt);
    }
}

async function deleteAndStoreItem(entityName, id, requestState, store, onSuccess, onFail) {
    // const logPath = pathMkr(logRoot, deleteAndStoreItem, entityType.name, '↓↓');
    // logv(logPath, {id, tree});
    const tree = store[entityName];
    if (tree.state[id]) {
        await remote.delete(
            entityTypes[entityName], id, requestState,
            (response) => {
                // console.log(`deleted id=`, id);
                tree.del(id);
                onSuccess?.(response);
            },
            (error) => {
                const current = tree.state['failedDeletions'];
                if (current) {
                    tree.set('failedDeletions', [...current, id]);
                } else {
                    tree.add('failedDeletions', [id]);
                }
                // tree.del(id);
                onFail?.(error);
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
        propulsionType: useDict(),
        // timestamps is NOT an entity
        timestamps: useDict(initialTimestamps),
    };

    const [isAllLoaded, setAllLoaded] = useState(null);

    useMountEffect(() => loadAllEntities(() => setAllLoaded(true)));

    function getItem(entityName, id, requiredValidity = validities.full) {
        // const logPath = pathMkr(logRoot, getItem, entityName, id);
        const entry = store[entityName].state[id];
        // logv(logPath, {entry});
        if (entry?.validity >= requiredValidity)
            return entry.item;
    }

    // function getSummary(entityName, id) {
    //     return getItem(entityName, id, validities.summary);
    // }


    async function loadAllEntities(onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, loadAllIds);
        const requestState = new RequestState();
        // logv(logPath, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle gegevens `,
            advice: ''
        });
        await readAndStoreAllEntities(store, onSuccess, onFail);
    }

    async function loadItem(entityName, id, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, loadItem, entityName, id);
        // logv(logPath, {});
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het ophalen van ${entityTypes[entityName].label} (id=${id}) `,
            advice: '',
            // action: {type: loadItem.name, entityName},
        });
        await readAndStoreItem(entityName, id, requestState, store, onSuccess, onFail);
    }

    // async function loadSummariesByIds(entityName, idArray, onSuccess, onFail) {
    //     if (!(entityName in store)) return;
    //     const requestState = new RequestState();
    //     // console.log(`useStorage() » loadItem() » requestState=`, requestState);
    //     setRsStatus({
    //         requestState,
    //         description: `het ophalen van ${idArray.length} ${entityTypes[entityName].label} items `,
    //         advice: '',
    //         // action: {type: loadItemsByIds.name, entityName},
    //     });
    //     await readAndStoreSummariesByIds(entityName, idArray, requestState, store, onSuccess, onFail);
    // }

    async function loadItemsByIds(entityName, idArray, onSuccess, onFail) {
        if (!(entityName in store)) return;
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van ${idArray.length} ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadItemsByIds.name, entityName},
        });
        await readAndStoreItemsByIds(entityName, idArray, requestState, store, onSuccess, onFail);
    }

    // async function loadAllSummaries(entityName, onSuccess, onFail) {
    //     if (!(entityName in store)) return;
    //     const requestState = new RequestState();
    //     // console.log(`useStorage() » loadItem() » requestState=`, requestState);
    //     setRsStatus({
    //         requestState,
    //         description: `het ophalen van alle ${entityTypes[entityName].label} items `,
    //         advice: '',
    //         // action: {type: loadAllSummaries.name, entityName},
    //     });
    //     await readAndStoreAllSummaries(entityName, requestState, store, onSuccess, onFail);
    // }

    async function loadAllItems(entityName, onSuccess, onFail) {
        if (!(entityName in store)) return;
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadAllItems.name, entityName},
        });
        await readAndStoreAllItems(entityName, requestState, store, onSuccess, onFail);
    }

    async function loadChangedItems(entityName, onSuccess, onFail) {
        if (!(entityName in store)) return;
        const requestState = new RequestState();
        // logv(pathMkr(logRoot, loadChangedItems), {requestState});
        setRsStatus({
            requestState,
            description: `het ophalen van nieuwe ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadChangedItems.name, entityName},
        });
        await readAndStoreChangedItems(entityName, requestState, store, onSuccess, onFail);
    }

    async function loadItemByUniqueFields(entityName, probe, onSuccess, onFail) {
        // console.log(`loadItemByUniqueFields(${entityName}, probe) \n probe=`, probe);
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het ophalen van de ${entityTypes[entityName].label} match `,
            advice: '',
            // action: {type: loadItemByUniqueFields.name, entityName, probe},
        });
        await readAndStoreItemByUniqueFields(entityName, probe, requestState, store, onSuccess, onFail);
    }

    async function saveItem(entityName, item, onSuccess, onFail) {
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
        await updateAndStoreItem(entityName, item, requestState, store, onSuccess, onFail);
    }

    async function newItem(entityName, item, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, newItem, entityName, '↓');
        // logv(logPath, {item});
        item.id = -1;// prevent collision in store
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het maken van een nieuwe ${entityTypes[entityName].label} `,
            advice: '',
            // action: {type: newItem.name, entityName, id: 0},
        });
        await createAndStoreItem(entityName, item, requestState, store, onSuccess, onFail);
    }

    async function deleteItem(entityName, id, onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, deleteItem, entityName, '↓');
        // logv(logPath, {id});
        if (!store[entityName]?.state[id]) {
            console.error(`id doesn't exist in storage:`, store[entityName]?.state);
            return;
        }
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het verwijderen van ${entityTypes[entityName].label} (id=${id}) `,
            advice: '',
            // action: {type: deleteItem.name, entityName, id},
        });
        await deleteAndStoreItem(entityName, id, requestState, store, onSuccess, onFail);
    }


    return {
        isAllLoaded,
        rsStatus, setRsStatus,
        store,
        getItem,
        loadItem,
        loadItemsByIds,
        loadAllItems,
        loadChangedItems,
        saveItem,
        newItem,
        deleteItem,
        loadItemByUniqueFields
    };
}

