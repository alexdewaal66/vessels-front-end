import { useEffect, useState } from 'react';
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

    requestState.isIdle = requestState.value === requestStates.IDLE;
    requestState.isPending = requestState.value === requestStates.PENDING;
    requestState.isSuccess = requestState.value === requestStates.SUCCESS;
    requestState.isError = requestState.value === requestStates.ERROR;

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

/****************************

const cap1st = (string) => string[0].toUpperCase() + string.slice(1);

function useMultiState(...subStates) {
    // each subState is an array with a name and init element ['x', 1]
    const multiState = {};
    for (const subState of subStates) {
        const [name, init] = subState;
        [multiState[name], multiState[`set${cap1st(name)}`]] = useState(init);
    }
    return multiState;
}

function Test() {
    const myMultiState = useMultiState(
        ['firstState', 2],
        ['secondState', 4],
        ['third', 8 ],
    )

}

*********************************************/