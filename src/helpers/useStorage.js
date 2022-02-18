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

async function readAndStoreIds(metadata, requestState, tree) {
    await remote.readAllIds(
        metadata, requestState,
        (response) =>
            transformAndStoreIdArray(response.data, tree)
    );
}

async function readAndStoreAllIds(forest) {
    // logv(pathMkr(logRoot, readAndStoreAllIds), {forest});
    const treeNames = Object.keys(forest);
    await Promise.all(
        treeNames.map(async name => {
                const requestState = new RequestState();
                await readAndStoreIds(entityTypes[name], requestState, forest[name]);
            }
        )
    );
}

function transformAndStoreItemArray(metadata, data, tree, validity) {
    const idKey = metadata.id;
    const branches = Object.fromEntries(data.map(item =>
            [item[idKey], {item, validity,}]
        )
    );
    // logv(pathMkr(logRoot, transformAndStoreItemArray, ), {branches});
    // console.log(`->-> branches=`, branches);
    tree.setMany(branches);
}

async function readAndStoreSummariesByIds(metadata, idArray, requestState, tree) {
    await remote.readSummariesByIds(
        metadata, idArray, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree, validities.summary)
    )
}

async function readAndStoreItemsByIds(metadata, idArray, requestState, tree) {
    await remote.readItemsByIds(
        metadata, idArray, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree, validities.full)
    )
}

async function readAndStoreAllSummaries(metadata, requestState, tree) {
    await remote.readAllSummaries(
        metadata, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree, validities.summary)
    )
}

async function readAndStoreAllItems(metadata, requestState, tree) {
    await remote.readAllItems(
        metadata, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree, validities.full)
    )
}


/**
 * @callback successCallback
 * @param {Object} item
 *//**
 * @param metadata
 * @param id
 * @param requestState
 * @param tree
 * @param {successCallback} onSuccess
 * @returns {Promise<void>}
 */
async function readAndStoreItem(metadata, id, requestState, tree, onSuccess) {
    // const logPath = pathMkr(logRoot, readAndStoreItem, '↓↓');
    // const branch = tree.state[id];
    // logv(logPath, {entityName: metadata.name, id, tree});
    await remote.read(
        metadata, id, requestState,
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

async function readAndStoreItemByUniqueFields(metadata, probe, requestState, tree, onSuccess) {
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
            // logv(pathMkr(logRoot, readAndStoreItemByUniqueFields, metadata.name), {probe, item});
            onSuccess(foundId);
        },
        doNothing
    );
}

async function updateAndStoreItem(metadata, item, requestState, tree, onSuccess) {
    // const logPath = pathMkr(logRoot, updateAndStoreItem, metadata.name, '↓↓');
    // logv(logPath, {item, tree});
    // const branch = tree.state[item.id];
    if (tree.state[item.id]) {
        await remote.update(
            metadata, item, requestState,
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

async function createAndStoreItem(metadata, item, requestState, tree) {
    const doLog = false || metadata === entityTypes.vesselType ;//|| url.includes('images');
    const logPath = pathMkr(logRoot, createAndStoreItem, metadata.name, '↓↓');
    // const branch = tree.state[item.id];
    // logv(logPath, {item, tree});
    if (!tree.state[item.id]) {
        await remote.create(
            metadata, item, requestState,
            (response) => {
                logv(logPath, {item, response_data: response.data, metadata_name: metadata.name});
                item.id = extractNewId(response.data, metadata.name);
                logv(null, {item_id: item.id});
                if (metadata.needsReload) {
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

async function deleteAndStoreItem(metadata, id, requestState, tree) {
    // const logPath = pathMkr(logRoot, deleteAndStoreItem, metadata.name, '↓↓');
    // logv(logPath, {id, tree});
    if (tree.state[id]) {
        await remote.delete(
            metadata, id, requestState,
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
    };

    const deferredEntries = useImmutableSet();


    const [allIdsLoaded, setAllIdsLoaded] = useState(null);
    useMountEffect(() => loadAllIds(() => setAllIdsLoaded(true)));

    // useMountEffect(() => readAndStoreAllIds(requestState, storage.store));

    function loadAllIds(setFinished) {
        // const logPath = pathMkr(logRoot, loadAllIds);
        const requestState = new RequestState();
        // logv(logPath, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle IDs `,
            advice: ''
        });
        readAndStoreAllIds(store)
            .then(setFinished);
    }

    function getSummary(entityName, id) {
        return getItem(entityName, id, validities.summary);
    }

    /**
     * @function
     * @param entityName
     * @param id
     * @param requiredValidity
     * @returns {*}
     */
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

    function loadDeferredItems(entityName) {
        [...deferredEntries].forEach(entry => {
            const [entryName, entryId] = entry.split('/');
            if (entryName === entityName)
                loadItem(entryName, +entryId, () => {
                    deferredEntries.del(entry)
                });// each load & each del is a state change
        });
    }

    function loadItem(entityName, id, onSuccess) {
        // const logPath = pathMkr(logRoot, loadItem, entityName, id);
        // logv(logPath, {});
        // if (!storage.store[entityName]?.state[id]) return;//TODO onnodig/lastig/??
        const tree = store[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het ophalen van ${entityTypes[entityName].label} (id=${id}) `,
            advice: '',
            // action: {type: loadItem.name, entityName},
        });
        readAndStoreItem(entityTypes[entityName], id, requestState, tree, onSuccess)
            .then();
    }

    function loadSummariesByIds(entityName, idArray, onSuccess) {
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
        readAndStoreSummariesByIds(entityTypes[entityName], idArray, requestState, tree)
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
        readAndStoreItemsByIds(entityTypes[entityName], idArray, requestState, tree)
            .then(onSuccess);
    }

    function loadAllSummaries(entityName, onSuccess) {
        if (!(entityName in store)) return;
        const tree = store[entityName];
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadAllSummaries.name, entityName},
        });
        readAndStoreAllSummaries(entityTypes[entityName], requestState, tree)
            .then(onSuccess);
    }

    function loadAllItems(entityName, onSuccess) {
        if (!(entityName in store)) return;
        const tree = store[entityName];
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle ${entityTypes[entityName].label} items `,
            advice: '',
            // action: {type: loadAllItems.name, entityName},
        });
        readAndStoreAllItems(entityTypes[entityName], requestState, tree)
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
        readAndStoreItemByUniqueFields(entityTypes[entityName], probe, requestState, tree, setResult)
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
        const tree = store[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het bewaren van ${entityTypes[entityName].label} (id=${id}) `,
            advice: '',
            // action: {type: saveItem.name, entityName, id},
        });
        updateAndStoreItem(entityTypes[entityName], item, requestState, tree, onSuccess).then();
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
        allIdsLoaded,
        rsStatus, setRsStatus,
        store,
        getItem, getSummary,
        loadDeferredItems,
        loadItem,
        loadItemsByIds,
        loadAllItems,
        loadSummariesByIds,
        saveItem,
        newItem,
        deleteItem,
        loadItemByUniqueFields
    };
}

