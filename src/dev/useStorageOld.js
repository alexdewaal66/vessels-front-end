import { entityNameList, entityTypes, transformEntries, } from '../helpers/entityTypes';
import { now, remote, RequestState, useConditionalEffect, useDict, useMountEffect } from '../helpers';
import { useState } from 'react';
import { errv, logConditionally, logv, pathMkr} from './log';
import { useStaticObject } from '../helpers/useStaticObject';


export const validities = {none: 0, id: 1, summary: 2, full: 3};

const initialTimestamps = Object.fromEntries(entityNameList.map(name => [name, 0]));

const logRoot = useStorageOld.name + '.js';


function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


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

// async function retrieveAndStoreIds(entityType, requestState, tree) {
//     await remote.retrieveAllIds(
//         entityType, requestState,
//         (response) =>
//             transformAndStoreIdArray(response.data, tree)
//     );
// }

// async function retrieveAndStoreAllIds(store) {
//     // logv(pathMkr(logRoot, retrieveAndStoreAllIds), {store});
//     await Promise.all(
//         entityNameList.map(async name => {
//                 const requestState = new RequestState();
//                 await retrieveAndStoreIds(entityTypes[name], requestState, store[name]);
//             }
//         )
//     );
// }

// async function retrieveAndStoreAllEntitiesConvoluted(store, onSucces, onFail) {
//     const logPath = pathMkr(logRoot, retrieveAndStoreAllEntitiesConvoluted());
//     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     // const nameList = entityNameList;// storingOrderEntityNames(entityTypes);
//     // logv(logPath, {nameList});
//     // const indexEntries = nameList.map((name, index) => [name, index]);
//     // const completions = {
//     //     list: nameList.map(name => ({name, loaded: false, done: false, callback: null})),
//     //     indexes: Object.fromEntries(indexEntries),
//     //     get: function (name) {
//     //         return this.list[this.indexes[name]];
//     //     },
//     // };
//     // logv(null, {nameList, completions});
//     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     let notStoredCount = entityNameList.length;
//     const storedEntities = Object.fromEntries(entityNameList.map(name => [name, false]));
//     logv(logPath, {notStoredCount});
//     await Promise.all(
//         entityNameList.map(async name => {
//                 const log = new VarLog(logPath, name);
//                 const requestState = new RequestState();
//                 // await retrieveAndOrderedStoreAllItems(completions, name, requestState, store, onSucces, onFail);
//                 await retrieveAndStoreAllItems(name, requestState, store,
//                     (response) => {
//                         const responseLength = response.data.length;
//                         log.x({name}, 'onSucces anon fn');
//                         store[name].setOnStateChange((state) => {
//                             const stateLength = Object.keys(store[name].state).length;
//                             // console.log('in callback()', {name, doLog: log.doLog(), state});
//                             log.x({name, notStoredCount, storedEntities, state, responseLength},
//                                 useDict.name + ' » callback');
//                             if (stateLength === responseLength) {
//                                 log.x({as_arg: state, in_store: store[name].state},
//                                     '😁 response data in state\n', true);
//                                 notStoredCount--;
//                                 storedEntities[name] = true;
//                                 log.x({storedEntities, store}, '😁 ');
//                                 if (notStoredCount === 0) {// last entity had state change
//                                     log.x({entityTypes, store}, 'all stored ', true);
//                                     entityNameList.forEach(targetName => {
//                                         // if (targetName === 'image')
//                                         setReferences(targetName, store);
//                                     });
//                                 }
//                             }
//                         });
//                         onSucces?.(response);
//                     },
//                     onFail);
//                 // }
//             }
//         )
//     );
//     //TODO❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌
//     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     // [...nameList].reverse().forEach(name => {
//     //     logv(logPath, {name}, 'setOnStateChange')
//     //     store[name].setOnStateChange(completions.get(name).callback);
//     // });
//     // completions.list.forEach(completion => {
//     //     //logv(logPath + ' completions', {completion,completions});
//     //     try {
//     //         completion.callback();
//     //     } catch (e) {
//     //         logv(logPath + ' completions', {completion, users: store.user, completions, store}, '❌❌')
//     //     }
//     // });
//     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// }

// function targets(entityTypes, entityName) {
//     // const logPath = pathMkr(logRoot, targets, entityName);
//     // const doLog = logConditionally(entityName);
//     // if (doLog) logv(logPath, {});
//     const targetList = entityTypes[entityName].targets.map(e => e.targetName);
//     // if (doLog) logv(null, {targetList});
//     return targetList;
// }

// function owners(entityTypes, entityName) {
//     // const logPath = pathMkr(logRoot, owners, entityName);
//     // const doLog = logConditionally(entityName);
//     // if (doLog) logv(logPath, {});
//     const ownerList = entityTypes[entityName].owners.map(e => e.ownerName);
//     // if (doLog) logv(null, {ownerList});
//     return ownerList;
// }

// const compareEntities = (entityTypes) => (a, b) => {
//     const logPath = pathMkr(logRoot, compareEntities, a, b);
//     const doLog = logConditionally(a, b);
//     // if (doLog) logv(logPath);
//     const is_b_targetOf_a = targets(entityTypes, a).includes(b);
//     const is_a_targetOf_b = targets(entityTypes, b).includes(a);
//     const is_a_ownerOf_b = owners(entityTypes, a).includes(b);
//     const is_b_ownerOf_a = owners(entityTypes, b).includes(a);
//     if (is_a_ownerOf_b !== is_b_targetOf_a) console.error();
//     if (is_b_ownerOf_a !== is_a_targetOf_b) console.error();
//     // if (doLog) logv(logPath, {is_b_targetOf_a, is_a_targetOf_b});
//     return (is_b_targetOf_a) ? 1 : (is_a_targetOf_b) ? -1 : 0;
// }

// function targetSort(arr, compare) {
//     for (let i = 0; i < arr.length; i++) {
//         for (let j = i + 1; j < arr.length; j++) {
//             if (compare(arr[i], arr[j]) > 0) {
//                 let temp = arr[i];
//                 arr[i] = arr[j];
//                 arr[j] = temp;
//             }
//         }
//     }
// }

// function storingOrderEntityNames(entityTypes) {
//     const logPath = pathMkr(logRoot, storingOrderEntityNames);
//     const entityNameList = Object.keys(entityTypes);
//     logv(logPath, {entityNameList}, 'BEFORE: ');
//     // entityNameList.sort(compareEntities(entityTypes));//.reverse();
//     targetSort(entityNameList, compareEntities(entityTypes));
//     logv(logPath, {entityNameList}, 'AFTER #1: ');
//     // entityNameList.sort(compareEntities(entityTypes));
//     // logv(logPath, {entityNameList}, 'AFTER #2: ');
//     // entityNameList.sort(compareEntities(entityTypes));
//     // logv(logPath, {entityNameList}, 'AFTER #3: ');
//     return entityNameList;
// }

// const replaceNestedObjectByReference = (entityName, store) => ([fieldName, value]) => {
//     const logPath = pathMkr(logRoot, replaceNestedObjectByReference, entityName);
//     const doLog = logConditionally(entityName);
//     const field = entityTypes[entityName].fields[fieldName];
//     const fieldType = field?.type;
//     switch (fieldType) {
//         case fieldTypes.obj:
//         case fieldTypes.img:
//             const targetName = field.target;
//             if (doLog) logv(logPath, {fieldName, value, field});
//             const get = () => store.getItem(targetName, value?.id);
//             return [fieldName, get];
//         case fieldTypes.arr:
//         // break;
//         default:
//             return [fieldName, value];
//     }
// }

// function makeHandler(entityTypes, entityName, store) {
//     const typeFields = entityTypes[entityName].fields;
//
//     return {
//         get: (item, propName) => {
//             if (propName in item) {
//                 const fieldDesc = typeFields[propName];
//                 switch (fieldDesc?.type) {
//                     case fieldTypes.obj:
//                     case fieldTypes.img:
//                         const targetName = fieldDesc.target;
//                         const targetId = item[propName]?.id;
//                         return store[targetName].state[targetId]?.item || null;
//                     default:
//                         return item[propName];
//                 }
//             }
//             logv(pathMkr(logRoot, makeHandler, entityName), {propName});
//         },
//     }
// }

// function transformItem(entityName, item, store) {
//     const handler = makeHandler(entityTypes, entityName, store);
//     return new Proxy(item, handler);
// }

// function transformItem(entityName, item, store) {
//     return transformEntries(item, replaceNestedObjectByReference(entityName, store));
// }

// const addOwner = (ownerName, ownerId, fieldName) => (entry) => {
//     const doLog = logConditionally(ownerName);
//     if (doLog) logv(pathMkr(logRoot, addOwner, '↓↓'), {ownerName, ownerId, fieldName, entry});
//     entry.owners[ownerName + '.' + ownerId] = fieldName;
//     return entry;
// }

// function setExternalReferences(ownerName, item, store) {
//     // const entry = store[ownerName].state[item.id];
//     const targets = entityTypes[ownerName].targets;
//     targets.forEach(({fieldName, targetName}) => {
//         if (item[fieldName]) {
//             const targetId = item[fieldName].id;
//             if (ownerName !== targetName) {
//                 store[targetName].set(targetId, addOwner(ownerName, item.id, fieldName));
//             }
//         }
//     });
//     return {};
// }

// function setInternalReferences(ownerName, item, store) {
//     // const entry = store[ownerName].state[item.id];
//     const targets = entityTypes[ownerName].targets;
//     targets.forEach(({fieldName, targetName}) => {
//         if (item[fieldName]) {
//             const targetId = item[fieldName].id;
//             if (ownerName === targetName) {
//                 store[ownerName].set(targetId, addOwner(ownerName, item.id, fieldName));
//                 // return {[ownerName + '.' + item.id]: fieldName}
//             }
//         }
//     });
//     return {};
// }

function transformAndStoreItemArray(entityName, data, store, validity) {
    const logPath = pathMkr(logRoot, transformAndStoreItemArray);
    const doLog = logConditionally(entityName);
    if (doLog) logv(logPath, {entityName, data});
    let youngest = store.timestamps.state[entityName] || 0;
    const entries = Object.fromEntries(data.map(item => {
            // setExternalReferences(entityName, item, store);
            youngest = Math.max(youngest, item.timestamp);
            return [item.id, {item, validity, owners: {}}];
        })
    );
    // if (doLog) logv(logPath, {youngest});
    store.timestamps.set(entityName, youngest);
    if (doLog) logv(null, {entries});
    store[entityName].setMany(entries);
    // data.forEach(item => {
    //     setInternalReferences(entityName, item, store);
    // });
}

function transformAndRemoveDeletionArray(entityName, deletions, store) {
    const logPath = pathMkr(logRoot, transformAndRemoveDeletionArray);
    const doLog = false;// logConditionally(entityName);
    if (doLog) logv(logPath, {entityName, data: deletions});
    let youngest = store.timestamps.state[entityName] || 0;
    const idList = deletions.map(item => {
        youngest = Math.max(youngest, item.timestamp);
        return item['itemId'];
    });
    if (doLog) logv(null, {idList});
    store[entityName].delMany(idList);
}

// async function retrieveAndStoreSummariesByIds(entityName, idArray, requestState, store, onSuccess, onFail) {
//     await remote.retrieveSummariesByIds(
//         entityTypes[entityName], idArray, requestState,
//         (response) => {
//             transformAndStoreItemArray(entityName, response.data, store, validities.summary);
//             onSuccess?.(response);
//         },
//         onFail
//     )
// }

async function retrieveAndStoreItemsByIds(entityName, idArray, requestState, store, onSuccess, onFail) {
    await remote.retrieveItemsByIds(
        entityTypes[entityName], idArray, requestState,
        (response) => {
            transformAndStoreItemArray(entityName, response.data, store, validities.full);
            onSuccess?.(response);
        },
        onFail
    )
}

// async function retrieveAndStoreAllSummaries(entityName, requestState, store, onSuccess, onFail) {
//     await remote.retrieveAllSummaries(
//         entityTypes[entityName], requestState,
//         (response) => {
//             transformAndStoreItemArray(entityName, response.data, store, validities.summary);
//             onSuccess?.(response);
//         },
//         onFail
//     )
// }

// async function retrieveAndOrderedStoreAllItems(completions, entityName, requestState, store, onSuccess, onFail) {
//     const logPath = pathMkr(logRoot, retrieveAndOrderedStoreAllItems, entityName)
//     if (!entityTypes[entityName]) logv(logPath, {entityName}, '❌');
//     await remote.retrieveAllItems(
//         entityTypes[entityName], requestState,
//         (response) => {
//             const completion = completions.get(entityName);
//             completion.loaded = true;
//             completion.callback = () => {
//                 if (entityName === 'role') logv(logPath, {completion, response_data: response.data});
//                 transformAndStoreItemArray(entityName, response.data, store, validities.full);
//                 if (entityName === 'role') logv(logPath, {store_role_state: store.role.state});
//                 completion.done = true;
//                 onSuccess?.(response);
//                 // completion.callback = null;
//             };
//         },
//         onFail
//     )
// }

async function retrieveAndStoreChangedItems(entityName, requestState, store, onSuccess, onFail) {
    const logPath = pathMkr(logRoot, retrieveAndStoreChangedItems, entityName);
    const timestamp1 = store.timestamps.state[entityName];
    const timestamp2 = timestamp1 || 1640995200000; // 2022-01-01 00:00:00.000
    // logv(logPath, {entityName, timestamp1, timestamp2,});
    await remote.retrieveChangedItems(
        entityTypes[entityName], timestamp2, requestState,
        (response) => {
            logv(logPath, {response_data: response.data});
            transformAndStoreItemArray(entityName, response.data.fresh, store, validities.full);
            transformAndRemoveDeletionArray(entityName, response.data.deletions, store);
            onSuccess?.(response);
        },
        onFail
    )
}

async function retrieveAndStoreItem(entityName, id, requestState, store, onSuccess, onFail) {
    // const logPath = pathMkr(logRoot, retrieveAndStoreItem, '↓↓');
    const tree = store[entityName];
    // logv(logPath, {entityName: entityType.name, id, tree});
    await remote.retrieve(
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

async function retrieveAndStoreItemByUniqueFields(entityName, probe, requestState, store, onSuccess, onFail) {
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
            logv(pathMkr(logRoot, retrieveAndStoreItemByUniqueFields, entityName), {probe, item});
            onSuccess?.(foundId);
        },
        onFail
    );
}

const updateReferringField = (fieldName, item) => (oldEntry) => ({
    ...oldEntry,
    [fieldName]: item
});

function updateItem(entityName, item, store) {
    const logPath = pathMkr(logRoot, updateItem, entityName);
    const doLog = logConditionally(entityName);
    store[entityName].set(item.id, oldEntry => {
        // update owners if there are any
        if (!isEmpty(oldEntry.owners)) {
            Object.entries(oldEntry.owners)
                .forEach(([ownerName, ownerIdFieldNameProps]) => {
                    if (true || doLog) logv(logPath, {ownerName, ownerIdFieldNameProps, item}, '->->->');
                    Object.entries(ownerIdFieldNameProps).forEach(([ownerId, ownerFieldName]) => {
                        logv(logPath, {ownerName, ownerId, ownerFieldName}, '👀');
                        store[ownerName].set(ownerId, updateReferringField(ownerFieldName, item));
                    });
                });
        }
        // update targets if they've changed
        return {
            ...oldEntry,
            item, success: now(),
            validity: validities.full,
        };
    });
}

async function updateAndStoreItem(entityName, item, requestState, store, onSuccess, onFail) {
    // const logPath = pathMkr(logRoot, updateAndStoreItem, entityType.name, '↓↓');
    const tree = store[entityName];
    // logv(logPath, {item, tree});
    if (tree.state[item.id]) {
        await remote.update(
            entityTypes[entityName], item, requestState,
            (response) => {
                updateItem(entityName, item, store);
                // tree.set(item.id, oldEntry => {
                //     if (!isEmpty(oldEntry.owners)) {
                //         Object.entries(oldEntry.owners)
                //             .forEach(([ownerDesc, ownerFieldName]) => {
                //                 const [ownerName, ownerId] = ownerDesc.split('.');
                //                 store[ownerName].set(ownerId,)
                //             });
                //     }
                //     return {
                //         ...oldEntry,
                //         item, success: now(),
                //         validity: validities.full,
                //     };
                // });
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
    const doLog = false;// || logConditionally(entityName);
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

export function useStorageOld() {
    // const logRoot = rootMkr(useStorage);
    const [rsStatus, setRsStatus] = useState({
        requestState: null,
        description: '-nog geen beschrijving-',
        advice: '-nog geen advies-'
    });

    const store = {
        // each entity gets its own dictionary to ease manipulation of props and to minimize impact of state changes
        xyz: useDict('xyz'),
        zyx: useDict('zyx'),
        vesselType: useDict('vesselType'),
        hull: useDict('hull'),
        vessel: useDict('vessel'),
        country: useDict('country'),
        address: useDict('address'),
        unLocode: useDict('unLocode'),
        subdivision: useDict('subdivision'),
        user: useDict('user'),
        role: useDict('role'),
        organisation: useDict('organisation'),
        relation: useDict('relation'),
        relationType: useDict('relationType'),
        file: useDict('file'),
        image: useDict('image'),
        propulsionType: useDict('propulsionType'),
        // timestamps is NOT an entity
        timestamps: useDict('timestamps', initialTimestamps),
    }

    const responseSizes = useStaticObject(
        {
            ...Object.fromEntries(entityNameList.map(name => [name, 0])),
            unloadedCount: entityNameList.length,
        }
    );


    const [isAllLoadedAndStored, setAllLoadedAndStored] = useState(null);

    const [isAllLoaded, setAllLoaded] = useState(null);

    //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--
    function getEntries(store, entityName) {
        // const logPath = pathMkr(logRoot, getEntry, entityName, id);
        return store[entityName].state;
    }

    function getEntry(store, entityName, id) {
        // const logPath = pathMkr(logRoot, getEntry, entityName, id);
        return store[entityName].state[id];
    }

    function getItem(store, entityName, id) {
        // const logPath = pathMkr(logRoot, getItem, entityName, id);
        return store[entityName].state[id]?.item;
    }

    function setEntries(store, entityName, value) {
        // const logPath = pathMkr(logRoot, getEntry, entityName, id);
        store[entityName].state = value;
    }

    function setEntry(store, entityName, id, value) {
        const logPath = pathMkr(logRoot, setEntry, entityName, id);
        if (!!store[entityName].state?.[id])
            store[entityName].state[id] = value;
        else
            errv(logPath, {entityName, id}, 'no such entry');
    }

    function setItem(store, entityName, id, value) {
        const logPath = pathMkr(logRoot, setItem, entityName, id);
        if (!!store[entityName].state?.[id]?.item)
            store[entityName].state[id].item = value;
        else
            errv(logPath, {entityName, id}, 'no such item');
    }
    //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--

    useMountEffect(async () => {
        await loadAllEntities();
        setAllLoadedAndStored(true);
    });

    useConditionalEffect(isAllLoadedAndStored, () => {
        logv(logRoot + ' » useConditionalEffect()', null, '-- 1 --  ');
        setReferencesOfAllEntities();
        logv(logRoot + ' » useConditionalEffect()', null, '-- 2 --  ');
        setAllLoaded(true);
    }, [isAllLoadedAndStored]);


    async function loadAllEntities(onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, loadAllIds);
        const requestState = new RequestState();
        // logv(logPath, requestState);
        setRsStatus({
            requestState,
            description: `het ophalen van alle gegevens `,
            advice: ''
        });
        await retrieveAndStoreAllEntities(store, onSuccess, onFail);
    }

    function setReferencesOfAllEntities() {
        const logPath = pathMkr(logRoot, setReferencesOfAllEntities);
        const entitiesWithReferences = Object.fromEntries(entityNameList.map(name => [name, false]));
        entityNameList.forEach(name => {
            setReferences(name, store);
            entitiesWithReferences[name] = true;
            logv(logPath, {name, entitiesWithReferences}, '>>>>>>');
        });
    }


    function getEntries(entityName) {
        // const logPath = pathMkr(logRoot, getEntry, entityName, id);
        const entries = store[entityName].state;
        // logv(logPath, {entry});
        return entries;
    }

    function getEntry(entityName, id) {
        // const logPath = pathMkr(logRoot, getEntry, entityName, id);
        const entry = (id == null) ? null : store[entityName].state[id];
        // logv(logPath, {entry});
        return entry;
    }

    function getItem(entityName, id) { //, requiredValidity = validities.full) {
        // const logPath = pathMkr(logRoot, getItem, entityName, id);
        const entry = (id == null) ? null : store[entityName].state[id];
        // logv(logPath, {entry});
        // if (entry?.validity >= requiredValidity)
        return entry.item;
    }

    // function getSummary(entityName, id) {
    //     return getItem(entityName, id, validities.summary);
    // }

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
        await retrieveAndStoreItem(entityName, id, requestState, store, onSuccess, onFail);
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
    //     await retrieveAndStoreSummariesByIds(entityName, idArray, requestState, store, onSuccess, onFail);
    // }

    // async function loadItemsByIds(entityName, idArray, onSuccess, onFail) {
    //     if (!(entityName in store)) return;
    //     const requestState = new RequestState();
    //     // console.log(`useStorage() » loadItem() » requestState=`, requestState);
    //     setRsStatus({
    //         requestState,
    //         description: `het ophalen van ${idArray.length} ${entityTypes[entityName].label} items `,
    //         advice: '',
    //         // action: {type: loadItemsByIds.name, entityName},
    //     });
    //     await retrieveAndStoreItemsByIds(entityName, idArray, requestState, store, onSuccess, onFail);
    // }

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
    //     await retrieveAndStoreAllSummaries(entityName, requestState, store, onSuccess, onFail);
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
        await retrieveAndStoreAllItems(entityName, requestState, store, onSuccess, onFail);
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
        await retrieveAndStoreChangedItems(entityName, requestState, store, onSuccess, onFail);
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
        await retrieveAndStoreItemByUniqueFields(entityName, probe, requestState, store, onSuccess, onFail);
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

    function makeMatcher(probe) {
        logv(pathMkr(logRoot, makeMatcher), {probe});

        function matchProbe(candidate) {
            const logMatch = pathMkr(logRoot, matchProbe);
            const properties = Object.entries(probe);
            logv(logMatch, {probe, candidate, properties});
            return properties.every(([k, v]) => {
                const isEmpty = (v == null || v === '');
                return isEmpty || (!isEmpty && v === candidate[k]);
            });
        }

        return matchProbe;
    }

    function findItems(entityName, probe) {
        const matchProbe = makeMatcher(probe);
        const logPath = pathMkr(logRoot, findItems);
        const entries = store[entityName].state;
        const itemList = Object.values(entries).map(entry => entry.item);
        const filteredList = itemList.filter(matchProbe);
        // const mappedList = filteredList.map(match => store[entityName].state[match.id].item);
        logv(logPath, {entityName, probe, entries, itemList, filteredList});
        return filteredList;
    }


    async function retrieveAndStoreAllEntities(store, onSucces, onFail) {
        // const logPath = pathMkr(logRoot, retrieveAndStoreAllEntities);
        // logv( logPath, {store});
        await Promise.all(
            entityNameList.map(async name => {
                const requestState = new RequestState();
                await retrieveAndStoreAllItems(name, requestState, store, onSucces, onFail);
            }));
    }

    async function retrieveAndStoreAllItems(entityName, requestState, store, onSuccess, onFail) {
        const logPath = pathMkr(logRoot, retrieveAndStoreAllItems, entityName);
        // if (!entityTypes[entityName]) logv(pathMkr(logRoot, retrieveAndStoreAllItems), {entityName});
        await remote.retrieveAllItems(
            entityTypes[entityName], requestState,
            (response) => {
                transformAndStoreItemArray(entityName, response.data, store, validities.full);
                responseSizes[entityName] = response.data.length;
                responseSizes.unloadedCount--;
                if (!true) logv(logPath, {
                    entityName,
                    responseSize: responseSizes[entityName],
                    unloadedCount: responseSizes.unloadedCount
                }, '❗👀');
                if (responseSizes.unloadedCount === 0) {
                    setAllLoadedAndStored(true);
                    console.log('✔ ', {responseSizes});
                }
                onSuccess?.(response);
            },
            onFail
        )
    }

    function setReferences(targetName, store) {
        const logPath = pathMkr(logRoot, setReferences, targetName);
        const doLog = logConditionally(targetName);
        const owners = entityTypes[targetName].owners;
        if (doLog) logv(logPath, {owners});
        store[targetName].setMany(currentState => {
            if (doLog) logv(logPath, {targetName, currentState, store, responseSizes}, 'BEFORE');
            owners.forEach(owner => {
                const ownerState = store[owner.ownerName].state;
                const ownerEntries = Object.values(ownerState);
                if (doLog) logv(logPath, {owner, ownerState, ownerEntries, store});
                ownerEntries.forEach(ownerEntry => {
                    // if (doLog) logv(logPath, {ownerEntry, owner}, '--');
                    const embeddedTarget = ownerEntry.item[owner.fieldName];
                    if (embeddedTarget) {
                        let targetIds;
                        if (Array.isArray(embeddedTarget)) {
                            targetIds = embeddedTarget.map(e => e.id);
                        } else {
                            targetIds = [embeddedTarget.id];
                        }
                        const ownerId = ownerEntry.item.id;
                        targetIds.forEach(targetId => {
                            const currentTargetEntry = currentState[targetId];
                            if (currentTargetEntry)
                                currentTargetEntry.owners[owner.ownerName] = {
                                    ...currentTargetEntry.owners[owner.ownerName],
                                    [ownerId]: owner.fieldName
                                };
                            else
                                logv(logPath, {ownerEntry, owner, currentState, targetId}, '❌ ');
                        });
                    }
                });
            });
            if (doLog) logv(logPath, {targetName, currentState}, 'AFTER');
            return currentState;
        });
    }


    return {
        isAllLoaded,
        rsStatus, setRsStatus,
        store,
        findItems,
        getEntries,
        getEntry,
        getItem,
        saveItem,
        newItem,
        deleteItem,

        loadItem,
        // loadItemsByIds,
        loadAllItems,
        loadChangedItems,
        loadItemByUniqueFields
    };
}

