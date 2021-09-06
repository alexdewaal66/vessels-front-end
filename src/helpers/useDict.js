import { useReducer } from 'react';

const dictActions = {
    add: 'add',
    setMany : 'setMany',
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
    const [dict, dispatch] = useReducer(dictReducer, initialState, initializer);
    const get = (key) => dict[key];
    const add = (key, value) =>
        dispatch({type: dictActions.add, payload: {key, value}});
    const setMany = (value) =>
        dispatch({type: dictActions.setMany, payload: {value}});
    const set = (key, value) =>
        dispatch({type: dictActions.set, payload: {key, value}});
    const del = (key, value) =>
        dispatch({type: dictActions.del, payload: {key, value}});
    return {dict, get, add, setMany, set, del};
}