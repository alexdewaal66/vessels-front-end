import { entitiesMetadata } from './entitiesMetadata';
import { useDict } from './useDict';
import { useMountEffect } from './customHooks';
import { remote } from '../dev/ormHelpers';
import { now } from './utils';
import { useRequestStateDict } from './useRequestDict';

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

function readAndStoreAllIds(createRequestState, forest) {
    // console.log(`readAndStoreAllIds() forest.state=`, forest.state);
    Object.keys(forest).forEach(name => {
            const requestState = createRequestState('readAndStoreIds', name);
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

function readAndStoreItemsByIds(metadata, idArray, createRequestState, tree) {
    const requestState = createRequestState(
        'readAndStoreItemsByIds', metadata.name,
        idArray[0], idArray.at(-1)
    );
    remote.readByIds(
        metadata, idArray, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree)
    )
}

function readAndStoreItem(metadata, id, createRequestState, tree) {
    const requestState = createRequestState('readAndStoreItem', metadata.name, id);
    // const branch = tree.state[id];
    // console.log(`>>> readAndStoreItem(${metadata.name}, ${id}) tree=`, tree);
    if (!tree.state[id].item) {
        remote.read(
            metadata, id, requestState,
            (response) => {
                const item = response.data;
                tree.set(id, {item, fetched: now()});
                // console.log(`getItem(${entityName}, ${id}) item=`, item);
            },
            () => {
                const current = tree.state[id];
                tree.set(id, {item: current.item, fetchFailed: now()});
            }
        );
    }
}

function updateAndStoreItem(metadata, item, createRequestState, tree) {
    const requestState = createRequestState('updateAndStoreItem', metadata.name, item.id);
    // const branch = tree.state[item.id];
    console.log(`>>> updateAndStoreItem(${metadata.name}, ${item.id}) tree=`, tree);
    if (tree.state[item.id]) {
        remote.update(
            metadata, item, requestState,
            (response) => {
                tree.set(item.id, {item, sent: now()});
            },
            () => {
                tree.set(item.id, {item, SendFailed: now()});
            }
        );
    }
}

export function useStorage() {
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
    // const requestState = useFakeRequestState();
    const {createRequestState} = useRequestStateDict();

    useMountEffect(() => readAndStoreAllIds(createRequestState, forest));

    // useMountEffect(() => readAndStoreAllIds(requestState, forest));

    function getItem(entityName, id) {
        // console.log(`getItem(${entityName}, ${id})`);
        if (!forest[entityName]?.state[id]) return;
        const tree = forest[entityName];
        readAndStoreItem(entitiesMetadata[entityName], id, createRequestState, tree);
        // readAndStoreItem(entitiesMetadata[entityName], id, requestState, tree);
    }

    function getItemsByIds(entityName, idArray) {
        if (!(entityName in forest)) return;
        const tree = forest[entityName];
        const absentItemsIdArray = idArray.filter(id => !tree.state[id].item);
        readAndStoreItemsByIds(entitiesMetadata[entityName], absentItemsIdArray, createRequestState, tree);
        // readAndStoreItemsByIds(entitiesMetadata[entityName], absentItemsIdArray, requestState, tree);
    }

    function saveItem(entityName, item) {
        console.log(`saveItem(${entityName}, item) \n item=`, item);
        if (!forest[entityName]?.state[item.id]) {
            console.log(`id doesn't exist in storage:`, forest[entityName]?.state);
            return;
        }
        const tree = forest[entityName];
        updateAndStoreItem(entitiesMetadata[entityName], item, createRequestState, tree);
    }

    return {store: forest, getItem, getItemsByIds, saveItem};
}

/* uses predefined requestState
function readAndStoreItem(metadata, id, requestState, tree) {
    // const branch = tree.state[id];
    // console.log(`>>> readAndStoreItem(${metadata.name}, ${id}) tree=`, tree);
    if (!tree.state[id].item) {
        remote.read(
            metadata,
            id,
            requestState,
            (response) => {
                const item = response.data;
                tree.set(id, {item, fetched: now()});
                // console.log(`getItem(${entityName}, ${id}) item=`, item);
            },
            () => {
                const current = tree.state[id];
                tree.set(id, {item: current.item, failed: now()});
            }
        );
    }
}

function readAndStoreAllIds(requestState, forest) {
    // console.log(`readAndStoreAllIds() forest.state=`, forest.state);
    Object.keys(forest).forEach(name => {
            readAndStoreIds(entitiesMetadata[name], requestState, forest[name]);
        }
    );
}

function readAndStoreItemsByIds(metadata, idArray, requestState, tree) {
    remote.readByIds(
        metadata, idArray, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree)
    )
}


 */