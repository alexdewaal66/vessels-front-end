import { entityNameList, entityNames, entityTypes, fieldTypes, referringFieldTypes, } from './globals/entityTypes';
import { text, now, remote, RequestState, useMountEffect } from './';
import { useState } from 'react';
import { errv, logCondition, logv, pathMkr } from '../dev/log';
import { optionalIdValue } from '../components/summaryList';


const initialTimestamps = Object.fromEntries(entityNameList.map(name => [name, 0]));

const logRoot = useStorage.name + '.js';


export function useStorage() {
    // const logRoot = rootMkr(useStorage);
    const [rsStatus, setRsStatus] = useState({
        requestState: null,
        description: '-nog geen beschrijving-',
        advice: '-nog geen advies-'
    });

    const [store, setStore] = useState({
        ...Object.fromEntries(entityNameList.map(name => [name, {}])),
        // timestamps is NOT an entity
        timestamps: initialTimestamps,
    });

    function updateState(callback, callerName) {
        const doLog = false;// || logCondition(useStorage, entityName);
        const logPath = pathMkr(logRoot, updateState, callerName);
        if (doLog) logv(logPath, {callback}, '‼‼');
        setStore(currentState => {
            callback(currentState);
            return currentState;
        });
    }

    const collectionNames = {...entityNames, timestamps: 'timestamps'};


    class Item {
        #ids = {};

        constructor(entityName, itemValues = []) {
            const typeFields = entityTypes[entityName].fields
            for (const fieldName in itemValues) {
                if (referringFieldTypes.includes(typeFields[fieldName]?.type)) {
                    const targetName = typeFields[fieldName].target;
                    // const logPathGet = pathMkr(rootMkr('Item', entityName, itemValues.id), 'get');
                    const logPathGet = pathMkr('Item', 'get', entityName, itemValues.id);
                    const doLog = logCondition('Item constructor', entityName, fieldName, targetName);
                    if (typeFields[fieldName].type === fieldTypes.arr) {
                        const idList = itemValues[fieldName].map(targetItem => targetItem?.id);
                        this.#ids[fieldName] = idList;
                        Object.defineProperty(this, fieldName, {
                            get: () => {
                                const targetIdList = this.#ids[fieldName];
                                if (doLog) logv(logPathGet, {fieldName, targetName, targetIdList});
                                return targetIdList.map(
                                    id => readItem(targetName, id, store)
                                );
                            },
                            set: (targetList) => {
                                this.#ids[fieldName] = targetList.map(targetItem => targetItem.id);
                            },
                            enumerable: true,
                        });
                    } else {
                        this.#ids[fieldName] = itemValues[fieldName]?.id || null;
                        Object.defineProperty(this, fieldName, {
                            get: () => {
                                const targetId = this.#ids[fieldName];
                                if (doLog) logv(logPathGet, {fieldName, targetName, targetId});
                                return readItem(targetName, targetId, store);
                            },
                            set: (targetItem) => {
                                this.#ids[fieldName] = targetItem.id;
                            },
                            enumerable: true,
                        });
                    }
                } else {
                    this[fieldName] = itemValues[fieldName];
                }
            }
        }

        toJSON() {
            let shallowItem = {};
            for (const itemKey in this) {
                if (this[itemKey]?.id)
                    shallowItem[itemKey] = {id: this[itemKey].id};
                else
                    shallowItem[itemKey] = this[itemKey];
            }
            return shallowItem;
        }

    }

    const [isAllLoaded, setAllLoaded] = useState(null);

    useMountEffect(async () => {
        await loadAllEntities();
        setAllLoaded(true);
    });


    async function loadAllEntities(onSuccess, onFail) {
        // const logPath = pathMkr(logRoot, loadAllIds);
        const requestState = new RequestState();
        // logv(logPath, requestState);
        setRsStatus({
            requestState,
            description: text({NL: 'het ophalen van alle gegevens ', EN: 'reading all data '}),
            advice: ''
        });
        await retrieveAndStoreAllEntities(store, onSuccess, onFail);
    }

////----////----////----////----////----////----////----////----////----////----

    function hasCollection(collectionName, currentState = store) {
        // const logPath = pathMkr(logRoot, hasEntry, collectionName, id);
        return !!currentState?.[collectionName];
    }

    function hasEntry(collectionName, id, currentState = store) {
        // const logPath = pathMkr(logRoot, hasEntry, collectionName, id);
        return !!currentState[collectionName]?.[id];
    }

    function hasItem(collectionName, id, currentState = store) {
        // const logPath = pathMkr(logRoot, hasItem);
        return !!currentState[collectionName]?.[id]?.item;
    }

    function readCollection(collectionName, currentState = store) {
        // const logPath = pathMkr(logRoot, readCollection, collectionName, id);
        return currentState[collectionName];
    }

    function readEntry(collectionName, id, currentState = store) {
        // const logPath = pathMkr(logRoot, readEntry, collectionName, id);
        return currentState[collectionName][id];
    }

    function readItem(collectionName, id, currentState = store) {
        const logPath = pathMkr(logRoot, readItem);
        if (!id) return null;
        if (hasItem(collectionName, id, currentState))
            return currentState[collectionName][id].item;
        logv(logPath, {storeState: currentState, collectionName, id}, 'absent item');
        return null;
    }

    // function writeCollection(collectionName, entries, currentState) {
    //     // const logPath = pathMkr(logRoot, writeCollection);
    //     currentState[collectionName] = entries;
    // }

    function writeMoreEntries(collectionName, entries, currentState) {
        // const logPath = pathMkr(logRoot, writeMoreEntries, collectionName);
        // logv(logPath, )
        currentState[collectionName] = {...currentState[collectionName], ...entries};
    }

    function writeEntry(collectionName, id, currentState, entry) {
        const logPath = pathMkr(logRoot, writeEntry);
        if (collectionName === collectionNames.timestamps || entry.item instanceof Item)
            currentState[collectionName][id] = entry;
        else
            errv(logPath, {collectionName, id, entry}, 'entry.item is not an Item');
    }

    function writeItem(collectionName, id, value, currentState) {
        const logPath = pathMkr(logRoot, writeItem);
        const doLog = logCondition(useStorage, collectionName);
        let prompt = null;
        if (!currentState) prompt = 'no currentState';
        if (collectionName === collectionNames.timestamps) prompt = 'timestamps is no entity';
        if (!hasItem(collectionName, id, currentState)) prompt = 'absent item';
        if (prompt) {
            logv(logPath, {currentState, collectionName, id}, prompt);
            return;
        }
        if (doLog) logv(logPath, {currentState, collectionName, id, value});
        if (value instanceof Item)
            currentState[collectionName][id].item = value;
        else
            currentState[collectionName][id].item = new Item(collectionName, value);
    }

    function makeEntry(collectionName, id, entry, currentState) {
        const logPath = pathMkr(logRoot, makeEntry);
        let prompt = null;
        if (!currentState) prompt = 'no currentState';
        if (collectionName === collectionNames.timestamps) prompt = 'timestamps is no entity';
        if (hasEntry(collectionName, id, currentState)) prompt = 'entry already present';
        if (prompt) {
            logv(logPath, {currentState, collectionName, id}, prompt);
            return;
        }
        if (!(entry.item instanceof Item))
            entry.item = new Item(collectionName, entry.item);
        currentState[collectionName][id] = entry;
    }

    // function makeItem(collectionName, item, currentState) {
    //     const logPath = pathMkr(logRoot, makeItem);
    //     let prompt = null;
    //     if (!currentState) prompt = 'no currentState';
    //     if (collectionName === collectionNames.timestamps) prompt = 'timestamps is no entity';
    //     if (hasItem(collectionName, item.id, currentState)) prompt = 'item already present';
    //     if (prompt) {
    //         logv(logPath, {currentState, collectionName, item}, prompt);
    //         return;
    //     }
    //     if (!(item instanceof Item))
    //         item = new Item(collectionName, item);
    //     currentState[collectionName][item.id] = {item};
    // }

    function removeEntries(collectionName, idList, currentState) {
        // const logPath = pathMkr(logRoot, removeEntries, collectionName);
        const collection = currentState[collectionName];
        for (const id of idList)
            delete collection[id];
    }

    function removeEntry(collectionName, id, currentState) {
        const logPath = pathMkr(logRoot, removeEntry, collectionName);
        const collection = currentState[collectionName];
        delete collection[id];
        logv(logPath, {collection}, 'deleted? ');
    }

////----////----////----////----////----////----////----////----////----////----

    function transformAndStoreItemArray(entityName, data, currentState) {// ✔✔
        const logPath = pathMkr(logRoot, transformAndStoreItemArray);
        const doLog = logCondition(useStorage, entityName);
        if (doLog) logv(logPath, {entityName, data});
        let youngest = readEntry(collectionNames.timestamps, entityName, currentState) || 0;
        const entries = Object.fromEntries(data.map(retrievedItem => {
                youngest = Math.max(youngest, retrievedItem.timestamp);
                const item = new Item(entityName, retrievedItem);
                return [retrievedItem.id, {item}];
            })
        );
        // if (doLog) logv(logPath, {youngest});
        writeEntry(collectionNames.timestamps, entityName, currentState, youngest);
        if (doLog) logv(null, {entries});
        writeMoreEntries(entityName, entries, currentState);
    }

    function transformAndRemoveDeletionArray(entityName, deletions, currentState) {// ✔✔
        const logPath = pathMkr(logRoot, transformAndRemoveDeletionArray);
        const doLog = false;// logCondition(useStorage, entityName);
        if (doLog) logv(logPath, {entityName, data: deletions});
        let youngest = readEntry(collectionNames.timestamps, entityName, currentState) || 0;
        const idList = deletions.map(item => {
            youngest = Math.max(youngest, item.timestamp);
            return item['itemId'];
        });
        if (doLog) logv(null, {idList});
        removeEntries(entityName, idList, currentState);
    }

////----////----////----////----////----////----////----////----////----////----

    async function retrieveAndStoreChangedItems(entityName, requestState, dummyStore, onSuccess, onFail) {// ✔✔
        const logPath = pathMkr(logRoot, retrieveAndStoreChangedItems, entityName);
        const doLog = logCondition(useStorage, entityName);
        const timestamp1 = readEntry(collectionNames.timestamps, entityName);
        const timestamp2 = timestamp1 || 946684800000; // 2000-01-01
        if (doLog) logv(logPath, {timestamp1, timestamp2}, '‼')
        await remote.retrieveChangedItems(
            entityTypes[entityName], timestamp2, requestState,
            (response) => {
                // logv(logPath, {response_data: response.data}, '‼‼‼');
                const {fresh, deleted} = response.data;
                // only update if any changes:
                if (fresh.length > 0 || deleted.length > 0) {
                    updateState(currentState => {
                        transformAndStoreItemArray(entityName, fresh, currentState);
                        transformAndRemoveDeletionArray(entityName, deleted, currentState);
                    }, retrieveAndStoreChangedItems.name);
                }
                onSuccess?.(response);
            },
            onFail
        )
    }

    async function retrieveAndStoreItem(entityName, id, requestState, dummyStore, onSuccess, onFail) {// ✔✔
        // const logPath = pathMkr(logRoot, retrieveAndStoreItem, '↓↓');
        // logv(logPath, {entityName, id});
        await remote.retrieve(
            entityTypes[entityName], id, requestState,
            (response) => {
                const item = response.data;
                updateState(currentState => {
                    writeItem(entityName, id, item, currentState);
                }, retrieveAndStoreItem.name);
                // logv(null, {item});
                onSuccess?.(item);
            },
            (error) => {
                updateState(currentState => {
                    writeEntry(entityName, id, currentState, {fetchFailed: now()});
                }, retrieveAndStoreItem.name);
                onFail?.(error);
            }
        );
    }

    async function retrieveAndStoreItemByUniqueFields(entityName, probe, requestState, dummyStore, onSuccess, onFail) {// ✔✔
        let foundId = null;
        await remote.findByUniqueField(
            entityTypes[entityName], probe, requestState,
            (response) => {
                const item = response.data;
                updateState(currentState => {
                    writeItem(entityName, item.id, item, currentState);
                }, retrieveAndStoreItemByUniqueFields.name);
                foundId = item.id;
                logv(pathMkr(logRoot, retrieveAndStoreItemByUniqueFields, entityName), {probe, item});
                onSuccess?.(foundId);
            },
            onFail
        );
    }

    async function updateAndStoreItem(entityName, item, requestState, dummyStore, onSuccess, onFail) {// ✔✔
        const logPath = pathMkr(logRoot, updateAndStoreItem, entityName, '↓↓');
        const doLog = logCondition(useStorage, entityName);
        if (doLog) logv(logPath, {item});
        if (hasEntry(entityName, item.id, store)) {
            if (doLog) logv(logPath, null, 'about to update remote');
            await remote.update(
                entityTypes[entityName], item, requestState,
                (response) => {
                    if (doLog) logv(logPath, {response}, 'in onSuccess()');
                    // updateItem(entityName, item, store);
                    updateState(currentState => {
                        writeItem(entityName, item.id, item, currentState);
                    }, updateAndStoreItem.name);
                    onSuccess?.(response.data);
                },
                onFail
            );
        } else {
            logv(logPath, {store, entityName, item}, '❌ absent entry');
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

    async function createAndStoreItem(entityName, item, requestState, dummyStore, onSuccess, onFail) {// ✔✔
        const doLog = logCondition(useStorage, entityName);
        const logPath = pathMkr(logRoot, createAndStoreItem, entityName, '↓↓');
        const isEmpty = (item.id === optionalIdValue);
        if (doLog) logv(logPath, {item, isEmpty});
        item.id = -1;// prevent collision in store
        if (!hasEntry(entityName, item.id, store)) {
            await remote.create(
                entityTypes[entityName], item, requestState,
                (response) => {
                    if (doLog) logv(logPath, {item, response_data: response.data, entityName});
                    item.id = extractNewId(response.data, entityName);
                    if (doLog) logv(null, {item_id: item.id});
                    updateState(currentState => {
                        makeEntry(entityName, item.id, {item, isEmpty}, currentState);
                        // makeItem(entityName, item, currentState);
                    }, createAndStoreItem.name);
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

    async function deleteAndStoreItem(entityName, id, requestState, dummyStore, onSuccess, onFail) {// ✔✔
        const doLog = logCondition(useStorage, entityName);
        const logPath = pathMkr(logRoot, deleteAndStoreItem, entityName, '↓↓');
        if (doLog) logv(logPath, {id});
        if (hasEntry(entityName, id, store)) {
            await remote.delete(
                entityTypes[entityName], id, requestState,
                (response) => {
                    // console.log(`deleted id=`, id);
                    updateState(currentState => {
                        removeEntry(entityName, id, currentState);
                    }, deleteAndStoreItem.name);
                    onSuccess?.(response);
                },
                (error) => {
                    updateState(currentState => {
                        if (hasEntry(entityName, 'failedDeletions', currentState)) {
                            const current = readEntry(entityName, 'failedDeletions', currentState);
                            writeEntry(entityName, 'failedDeletions', currentState, [...current, id]);
                        } else {
                            writeEntry(entityName, 'failedDeletions', currentState, [id]);
                        }
                    }, deleteAndStoreItem.name);
                    onFail?.(error);
                }
            );
        }
    }

    async function retrieveAndStoreAllEntities(dummyStore, onSucces, onFail) {// ✔✔
        // const logPath = pathMkr(logRoot, retrieveAndStoreAllEntities);
        // logv( logPath, {store});
        await Promise.all(
            entityNameList.map(async name => {
                const requestState = new RequestState();
                await retrieveAndStoreAllItems(name, requestState, dummyStore, onSucces, onFail);
            }));
    }

    async function retrieveAndStoreAllItems(entityName, requestState, dummyStore, onSuccess, onFail) {// ✔✔
        // const logPath = pathMkr(logRoot, retrieveAndStoreAllItems, entityName);
        // if (!entityTypes[entityName]) logv(pathMkr(logRoot, retrieveAndStoreAllItems), {entityName});
        await remote.retrieveAllItems(
            entityTypes[entityName], requestState,
            (response) => {
                updateState(currentState => {
                    transformAndStoreItemArray(entityName, response.data, currentState);
                }, retrieveAndStoreAllItems.name);
                // setAllLoaded(true);
                onSuccess?.(response);
            },
            onFail
        )
    }


//‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/‾\_/


    async function loadItem(entityName, id, onSuccess, onFail) {// ✔✔
        // const logPath = pathMkr(logRoot, loadItem, entityName, id);
        // logv(logPath, {});
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: text({
                NL: 'het ophalen van ',
                EN: 'retrieving '
            }) + text(entityTypes[entityName].label) + ` (id=${id}) `,
            advice: '',
            // action: {type: loadItem.name, entityName},
        });
        await retrieveAndStoreItem(entityName, id, requestState, null, onSuccess, onFail);
    }

    async function loadAllItems(entityName, onSuccess, onFail) {// ✔✔
        if (!hasCollection(entityName)) return;
        const requestState = new RequestState();
        // console.log(`useStorage() » loadItem() » requestState=`, requestState);
        setRsStatus({
            requestState,
            description: text({
                NL: 'het ophalen van alle ',
                EN: 'retrieving all '
            }) + text(entityTypes[entityName].label) + ' items ',
            advice: '',
            // action: {type: loadAllItems.name, entityName},
        });
        await retrieveAndStoreAllItems(entityName, requestState, null, onSuccess, onFail);
    }

    async function loadChangedItems(entityName, onSuccess, onFail) {// ✔✔
        const logPath = pathMkr(logRoot, loadChangedItems, entityName);
        // logv(logPath, null, '👀')
        if (!hasCollection(entityName)) {
            logv(logPath, {entityName}, '❌❌ no such entity');
            return;
        }
        const requestState = new RequestState();
        // logv(pathMkr(logRoot, loadChangedItems), {requestState});
        setRsStatus({
            requestState,
            description: text({
                NL: 'het ophalen van nieuwe ',
                EN: 'retrieving new '
            }) + text(entityTypes[entityName].label) + ' items ',
            advice: '',
            // action: {type: loadChangedItems.name, entityName},
        });
        await retrieveAndStoreChangedItems(entityName, requestState, null, onSuccess, onFail);
    }

    async function loadItemByUniqueFields(entityName, probe, onSuccess, onFail) {// ✔✔
        // console.log(`loadItemByUniqueFields(${entityName}, probe) \n probe=`, probe);
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: text({
                NL: 'het ophalen van de ',
                EN: 'retrieving the '
            }) + text(entityTypes[entityName].label) + ' match ',
            advice: '',
            // action: {type: loadItemByUniqueFields.name, entityName, probe},
        });
        await retrieveAndStoreItemByUniqueFields(entityName, probe, requestState, null, onSuccess, onFail);
    }

    async function saveItem(entityName, item, onSuccess, onFail) {// ✔✔
        const logPath = pathMkr(logRoot, saveItem, entityName, '↓');
        logv(logPath, {item});
        const id = item.id;
        if (!hasEntry(entityName, id)) {
            errv(logPath, {store, entityName, id}, 'absent entry');
            return;
        }
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: text({
                NL: 'het bewaren van ',
                EN: 'saving '
            }) + text(entityTypes[entityName].label) + ` (id=${id}) `,
            advice: '',
            // action: {type: saveItem.name, entityName, id},
        });
        await updateAndStoreItem(entityName, item, requestState, null, onSuccess, onFail);
    }

    async function newItem(entityName, item, onSuccess, onFail) {// ✔✔
        // const logPath = pathMkr(logRoot, newItem, entityName, '↓');
        // logv(logPath, {item});
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: text({
                NL: 'het maken van een nieuwe ',
                EN: 'creating a new '
            }) + text(entityTypes[entityName].label) + ' ',
            advice: '',
            // action: {type: newItem.name, entityName, id: 0},
        });
        await createAndStoreItem(entityName, item, requestState, null, onSuccess, onFail);
    }

    async function deleteItem(entityName, id, onSuccess, onFail) {// ✔✔
        const logPath = pathMkr(logRoot, deleteItem, entityName, '↓');
        // logv(logPath, {id});
        if (!hasEntry(entityName, id)) {
            errv(logPath, {id}, 'absent entry');
            return;
        }
        const requestState = new RequestState();
        setRsStatus({
            requestState,
            description: text({
                NL: 'het verwijderen van ',
                EN: 'removing '
            }) + text(entityTypes[entityName].label) + ` (id=${id}) `,
            advice: '',
            // action: {type: deleteItem.name, entityName, id},
        });
        await deleteAndStoreItem(entityName, id, requestState, null, onSuccess, onFail);
    }

    function makeMatcher(probe) {
        // logv(pathMkr(logRoot, makeMatcher), {probe});

        function matchProbe(candidate) {
            // const logPath = pathMkr(logRoot, matchProbe);
            const properties = Object.entries(probe);
            // logv(logPath, {probe, candidate, properties});
            return properties.every(([k, v]) => {
                const isEmpty = (v == null || v === '');
                return isEmpty || (!isEmpty && v === candidate[k]);
            });
        }

        return matchProbe;
    }

    function findItems(entityName, probe) {
        // const logPath = pathMkr(logRoot, findItems);
        // const doLog = false;// || logCondition(useStorage, entityName);
        const matchProbe = makeMatcher(probe);
        const entries = readCollection(entityName);
        const itemList = entries ? Object.values(entries).map(entry => entry.item) : [];
        const filteredList = itemList.filter(matchProbe);
        // const mappedList = filteredList.map(match => store[entityName].state[match.id].item);
        // if (doLog) logv(logPath, {entityName, probe, entries, itemList, filteredList});
        return filteredList;
    }


    return {
        getItem: readItem,
        getEntry: readEntry,
        getEntries: readCollection,
        writeItem,
        isAllLoaded,
        rsStatus, setRsStatus,
        store,
        findItems,
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

