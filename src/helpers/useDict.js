import { useReducer } from 'react';

const dictActions = {
    add: 'add',
    setMany: 'setMany',
    set: 'set',
    del: 'del',
};

function UseDictException(message) {
    this.message = message;
    this.name = 'UseDictException';
}

function dictReducer(state, {type, payload: {key, value}}) {
    // console.log(`dictReducer() state=`, state);
    switch (type) {
        case dictActions.add:
            if (key in state) {
                throw new UseDictException(`can not add new entry ${key}, it already exists`);
            } else {
                return {...state, [key]: value};
            }
        case dictActions.setMany:
            // console.log(`dictReducer\ntype=`, type,`\nstate=`, state, `\nvalue=`, value);
            // skip presence test
            return {...state, ...value};
        case dictActions.set:
            if (key in state) {
                return {...state, [key]: value};
            } else {
                throw new UseDictException(`can not set entry ${key}, it doesn't exist`);
            }
        case dictActions.del:
            if (key in state) {
                const copy = {...state};
                delete copy[key];
                return copy;
            } else {
                throw new UseDictException(`can not delete entry ${key}, it doesn't exist`);
            }
        default:
            return state;
    }
}

export function useDict(initialState = {}, initializer) {
    const [state, dispatch] = useReducer(dictReducer, initialState, initializer);
    const get = (key) => state[key];
    const add = (key, value) =>
        dispatch({type: dictActions.add, payload: {key, value}});
    const setMany = (value) =>
        dispatch({type: dictActions.setMany, payload: {value}});
    const set = (key, value) =>
        dispatch({type: dictActions.set, payload: {key, value}});
    const del = (key, value= null) =>
        dispatch({type: dictActions.del, payload: {key, value: null}});

    return {state, get, add, setMany, set, del};
}

export const setEntryProp = (dict, key, propName) =>
    (v) => dict.set(key, {...dict.state[key], [propName]: v});



export function useSuperDict() {
    const dict = useDict();

    function createEntry(key, initialValue) {
        dict.add(key, {
            value: initialValue,
            set: setEntryProp(dict, key, 'value')
        });
        return dict.state[key];
    }

    return {createEntry, entries: dict.state};
}

