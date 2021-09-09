import { types, subtypes } from './endpoints';
import { entitiesMetadata } from './entitiesMetadata';
import { useDict } from './useDict';
import { useMountEffect, useRequestState } from './customHooks';
import { remote } from '../dev/ormHelpers';
import { useFakeRequestState } from './useFakeRequestState';
import { now } from './utils';
import { useRequestStateDict } from './useRequestDict';

const entityNamesWithReadIds = [
    'xyz', 'zyx', 'vesselType', 'country',
    'unLocode', 'subdivision', 'user'
];

function transformAndStoreIdArray(data, tree) {
    const branches = Object.fromEntries(data.map(
        id => [id, {item: null}]
        )
    );
    // console.log(`->-> branches=`, branches);
    tree.setMany(branches);
}

function loadIds(metadata, requestState, tree) {
    remote.readIds(
        metadata, requestState,
        (response) => transformAndStoreIdArray(response.data, tree)
    );
}

function loadAllIds(requestState, forest) {
    // console.log(`loadAllIds() forest.state=`, forest.state);
    Object.keys(forest).forEach(name => {
            loadIds(entitiesMetadata[name], requestState, forest[name]);
        }
    );
}

function loadAllIds2(createRequestState, forest) {
    // console.log(`loadAllIds() forest.state=`, forest.state);
    Object.keys(forest).forEach(name => {
            const requestState = createRequestState('loadIds', name);
            loadIds(entitiesMetadata[name], requestState, forest[name]);
        }
    );
}

function transformAndStoreItemArray(metadata, data, tree) {
    const idKey = metadata.id;
    const branches = Object.fromEntries(data.map(
        item => [item[idKey], {item}]
        )
    );
    // console.log(`->-> branches=`, branches);
    tree.setMany(branches);
}

function loadItemsByIds(metadata, idArray, requestState, tree) {
    remote.readByIds(
        metadata, idArray, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree)
    )
}

function loadItemsByIds2(metadata, idArray, createRequestState, tree) {
    const requestState = createRequestState(
        'loadItemsByIds', metadata.name,
        idArray[0], idArray.at(-1)
    );
    remote.readByIds(
        metadata, idArray, requestState,
        (response) => transformAndStoreItemArray(metadata, response.data, tree)
    )
}

function loadItem2(metadata, id, createRequestState, tree) {
    const requestState = createRequestState('loadItem', metadata.name, id);
    // const branch = tree.state[id];
    // console.log(`>>> loadItem(${metadata.name}, ${id}) tree=`, tree);
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

export function useStorage() {
    const forest = {
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

    useMountEffect(() => loadAllIds2(createRequestState, forest));
    // useMountEffect(() => loadAllIds2(requestState, forest));

    function getItem(entityName, id) {
        // console.log(`getItem(${entityName}, ${id})`);
        if (!forest[entityName]?.state[id]) return;
        const tree = forest[entityName];
        loadItem2(entitiesMetadata[entityName], id, createRequestState, tree);
        // loadItem(entitiesMetadata[entityName], id, requestState, tree);
    }

    function getItemsByIds(entityName, idArray) {
        if (!(entityName in forest)) return;
        const tree = forest[entityName];
        const absentItemsIdArray = idArray.filter(id => !tree.state[id].item);
        loadItemsByIds2(entitiesMetadata[entityName], absentItemsIdArray, createRequestState, tree);
        // loadItemsByIds(entitiesMetadata[entityName], absentItemsIdArray, requestState, tree);
    }

    return {store: forest, getItem, getItemsByIds};
}

/* uses predefined requestState
function loadItem(metadata, id, requestState, tree) {
    // const branch = tree.state[id];
    // console.log(`>>> loadItem(${metadata.name}, ${id}) tree=`, tree);
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


 */