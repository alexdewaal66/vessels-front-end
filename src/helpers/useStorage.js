import { types, subtypes } from './endpoints';
import { entitiesMetadata } from './entitiesMetadata';
import { useDict } from './useDict';
import { useMountEffect, useRequestState } from './customHooks';
import { remote } from '../dev/ormHelpers';
import { useFakeRequestState } from './useFakeRequestState';
import { now } from './utils';

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
    // console.log(`loadAllIds() forest.dict=`, forest.dict);
    Object.keys(forest).forEach(name =>
        loadIds(entitiesMetadata[name], requestState, forest[name])
    );
}

function transformAndStoreItemArray(metadata, data, tree) {
    const idKey = metadata.id;
    const branches = Object.fromEntries(data.map(
        item => [item[idKey], item]
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
    const requestState = useFakeRequestState();

    useMountEffect(() => loadAllIds(requestState, forest));

    function getItem(entityName, id) {
        // console.log(`getItem(${entityName}, ${id})`);
        if (!forest[entityName]?.dict[id]) return;
        let item = null;
        const tree = forest[entityName];
        const branch = tree.dict[id];
        // console.log(`>>> getItem(${entityName}, ${id}) tree=`, tree);
        if (!branch.item) { // fetch from remote
            remote.read(
                entitiesMetadata[entityName],
                id,
                requestState,
                (response) => {
                    item = response.data;
                    tree.set(id, {item, fetched: now()});
                    // console.log(`getItem(${entityName}, ${id}) item=`, item);
                },
                () => { //todo: replace with anything senseful
                    tree.set(id, {item: '❌', failed: now()});
                }
            );
        }
        // return item;
    }

    function getItemsByIds(entityName, idArray) {
        if (!entityName in forest) return;
        const tree = forest[entityName];
        // const absentItemsList = idArray.filter( id => !tree.dict[id].item );
        loadItemsByIds(entitiesMetadata[entityName], idArray, requestState, tree);
    }

    return {store: forest, getItem, getItemsByIds};
}

/*
const storeExample = {
    type: entitiesMetadata.zyx,
    '1': {item: {id: 1, name: 'zyx1', description: 'zyx1zyx1zyx1'}},
    '2': {item: null}
};

let itemArray = [ {id: 1, x: 'a'}, {id: 2, x: 'b'}, {id: 3, x: 'c'} ];
let branches = Object.fromEntries(itemArray.map( item => [item.id, item] );
*/