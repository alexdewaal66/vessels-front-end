import { useReducer } from 'react';

const dictActions = {
    add: 'add',
    set: 'set',
    del: 'del',
};

function UseDictException(message) {
    this.message = message;
    this.name = 'UseDictException';
}

function dictReducer(state, {type, payload: {name, value}}) {
    // console.log(`dictReducer() state=`, state);
    switch (type) {
        case dictActions.add:
            if (name in state) {
                throw new UseDictException(`can not add new entry ${name}, it already exists`);
            } else {
                return {...state, [name]: value};
            }
        case dictActions.set:
            if (name in state) {
                return {...state, [name]: value};
            } else {
                throw new UseDictException(`can not set entry ${name}, it doesn't exist`);
            }
        case dictActions.del:
            if (name in state) {
                const copy = {...state};
                delete copy[name];
                return copy;
            } else {
                throw new UseDictException(`can not delete entry ${name}, it doesn't exist`);
            }
        default:
            return state;
    }
}

export function useDict(initialState = {}, initializer) {
    const stateDict = {};
    /** @property stateDict.dict **/
    [stateDict.dict, stateDict.dispatch] = useReducer(dictReducer, initialState, initializer);
    stateDict.add = (name, value) =>
        stateDict.dispatch({type: dictActions.add, payload: {name, value}});
    stateDict.set = (name, value) =>
        stateDict.dispatch({type: dictActions.set, payload: {name, value}});
    stateDict.del = (name, value) =>
        stateDict.dispatch({type: dictActions.del, payload: {name, value}});
    return stateDict;
}