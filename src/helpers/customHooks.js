import { useEffect, useReducer, useState } from 'react';
import { requestStates } from './utils';

export function useConditionalEffect(operation, qualifier) {
    function conditionalOperation() {
        if (qualifier)
            operation();
    }

    useEffect(conditionalOperation, [qualifier]);
}

export function useMountEffect(fun) {
    useEffect(fun, []);
}

export function useOOState(initialValue) {
    const state = {};
    [state.value, state.set] = useState(initialValue);
    return state;
}


export function useRequestState(initialValue = requestStates.IDLE) {
    const requestState = {};
    [requestState.value, requestState.set] = useState(initialValue);
    // (my) Webstorm somehow cannot resolve the next members in the destructuring on its own
    /** @property requestState.errorMsg **/
    /** @member  requestState.setErrorMsg **/
    [requestState.errorMsg, requestState.setErrorMsg] = useState('');

    requestState.isIdle = (requestState.value === requestStates.IDLE);
    requestState.isPending = (requestState.value === requestStates.PENDING);
    requestState.isSuccess = (requestState.value === requestStates.SUCCESS);
    requestState.isError = (requestState.value === requestStates.ERROR);

    requestState.setAtIdle = () => {
        requestState.set(requestStates.IDLE)
    };
    requestState.setAtPending = () => {
        requestState.set(requestStates.PENDING)
    };
    requestState.setAtSuccess = () => {
        requestState.set(requestStates.SUCCESS)
    };
    requestState.setAtError = () => {
        requestState.set(requestStates.ERROR)
    };

    return requestState;
}

/****************************/

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
    console.log(`dictReducer() state=`, state);
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

//  export function useDict() {
//     const stateDict = {};
//     [stateDict.value, stateDict.dispatch] = useReducer(dictReducer, {});
//     stateDict.actions = dictActions;
//     return stateDict;
// }
/*********************************************/