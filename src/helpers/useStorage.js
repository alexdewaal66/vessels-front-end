import { entitiesMetadata } from './entitiesMetadata';
import { useDict } from './useDict';
import { useMountEffect } from './customHooks';
import { remote } from './remote';
import { now, makeId } from './utils';
import { useState } from 'react';
import { RequestState } from './RequestState';
import { logv, pathMkr } from '../dev/log';

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

function doNothing() {
}

function transformAndStoreIdArray(data, tree) {
    const entries = (typeof data[0] === 'number')
        ? data.map(idToEntry)
        : data.map(idItemToEntry);
    const branches = Object.fromEntries(entries);
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
        treeNames.map(async name => {
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

async function readAndStoreSummary(metadata, id, requestState, tree) {

}

async function readAndStoreItem(metadata, id, requestState, tree, onSuccess) {
    const logPath = pathMkr(logRoot, readAndStoreItem, '(↓↓)');
    // const branch = tree.state[id];
    logv(logPath, {entityName: metadata.name, id, tree});
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

async function updateAndStoreItem(metadata, item, requestState, tree, onSuccess) {
    // const branch = tree.state[item.id];
    console.log(`>>> updateAndStoreItem(${metadata.name}, ${item.id}) tree=`, tree);
    if (tree.state[item.id]) {
        await remote.update(
            metadata, item, requestState,
            () => {
                tree.set(item.id, {
                    item, sent: now(),
                    validity: validities.full,
                });
                onSuccess(item);
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

function extractNewId(message, name) {
    // message is formed like 'Xyz 237 created'
    const parts = message.split(' ');
    return (parts[0].toLowerCase() === name) ? parseInt(parts[1]) : null;
}

// function extract

async function createAndStoreItem(metadata, item, requestState, tree) {
    const logPath = `${logRoot} » ${createAndStoreItem.name}(${metadata.name}, ⬇, *, ⬇)`;
    // const branch = tree.state[item.id];
    // logv(logPath, {item, tree});
    if (!tree.state[item.id]) {
        await remote.create(
            metadata, item, requestState,
            (response) => {
                item.id = extractNewId(response.data, metadata.name);
                logv(logPath, {itemId: item.id});
                if (metadata.needsReload) {
                    logv(logPath + ' needsReload', {item})
                    tree.add(item.id, {
                        item, sent: now(),
                        validity: validities.id,
                    });
                } else {
                    tree.add(item.id, {
                        item, sent: now(),
                        validity: validities.full,
                    });
                }
            },
            () => {
                item.id = makeId();
                tree.set(item.id, {
                    item, createFailed: now(),
                    validity: validities.full,
                });
            }
        );
    } else {
        console.error(`useStorage.js » createAndStoreItem()\n\t item.id=${item.id} already exists`);
    }
}

async function deleteAndStoreItem(metadata, id, requestState, tree) {
    // const branch = tree.state[item.id];
    console.log(`>>> deleteAndStoreItem(${metadata.name}, ${id}) tree=`, tree);
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


export function useStorage() {
    const logRoot = useStorage.name;
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

    function getSummary(entityName, id) {
        return getItem(entityName, id, validities.summary);
    }

    function getItem(entityName, id, requiredValidity = validities.full) {
        const logPath = pathMkr(logRoot, getItem, entityName, id);
        const entry = forest[entityName].state[id];
        // logv(logPath, {entry});
        if (entry?.validity >= requiredValidity) {
            return entry.item;
        } else {
            logv('❌ ' + logPath, {entityName, id, entry, requiredValidity});
        }
    }

    function loadDeferredItems(deferredLoads) {
        deferredLoads.forEach(entity => loadItem(entity.name, entity.id));
    }

    function loadItem(entityName, id, onSuccess) {
        const logPath = pathMkr(logRoot, loadItem, entityName, id);
        logv(logPath, {});
        // if (!forest[entityName]?.state[id]) return;//TODO onnodig/lastig/??
        const tree = forest[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het ophalen van ${entitiesMetadata[entityName].label} (id=${id}) `,
            advice: ''
        });
        readAndStoreItem(entitiesMetadata[entityName], id, requestState, tree, onSuccess)
            .then();
    }

    function loadItemsByIds(entityName, idArray, onSuccess) {
        if (!(entityName in forest)) return;
        const tree = forest[entityName];
        // const absentItemsIdArray = idArray.filter(id => !tree.state[id].item.valid);
        const absentItemsIdArray = idArray;
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van ${absentItemsIdArray.length} ${entitiesMetadata[entityName].label} items `,
            advice: '',
            action: {type: 'loadItemsByIds', entityName},
        });
        readAndStoreItemsByIds(entitiesMetadata[entityName], absentItemsIdArray, requestState, tree)
            .then(onSuccess);
    }

    function loadItemByUniqueFields(entityName, probe, setResult, onSuccess) {
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
            .then(onSuccess);
    }

    function saveItem(entityName, item, onSuccess) {
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
            action: {type: 'saveItem', entityName, id},
        });
        updateAndStoreItem(entitiesMetadata[entityName], item, requestState, tree, onSuccess).then();
    }


    function newItem(entityName, item,
                     onSuccess = doNothing, onFail = doNothing) {
        // const logPath = `${logRoot} » ${newItem.name}(${entityName}, ⬇, *)`;
        // logv(logPath, {entityName, item, onSuccess});
        item.id = -1;// prevent collision in store
        const tree = forest[entityName];
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: `het maken van een nieuwe ${entitiesMetadata[entityName].label} `,
            advice: '',
            action: {type: 'newItem', entityName, id: 0},
        });
        createAndStoreItem(entitiesMetadata[entityName], item, requestState, tree)
            .then(
                () => onSuccess(item),
                () => onFail()
            );
    }

    function deleteItem(entityName, id, onSuccess) {
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
            .then(onSuccess);
    }


    return {
        allIdsLoaded,
        rsStatus,
        setRsStatus,
        store: forest,
        getItem,
        getSummary,
        loadDeferredItems,
        loadItem,
        loadItemsByIds,
        saveItem,
        newItem,
        deleteItem,
        loadItemByUniqueFields
    };
}
