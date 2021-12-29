import { useEffect, useState } from 'react';
import { requestStates } from './remote';

export function useConditionalEffect(operation, condition, deps) {
    useEffect(() => {
            if (condition)
                operation();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deps
    );
}

export function useMountEffect(fun) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fun, []);
}


export function useRequestState(initialValue = requestStates.IDLE) {
    const [value, set] = useState(initialValue);
    const [errorMsg, setErrorMsg] = useState('');

    const isIdle = (value === requestStates.IDLE);
    const isPending = (value === requestStates.PENDING);
    const isSuccess = (value === requestStates.SUCCESS);
    const isError = (value === requestStates.ERROR);

    const setAtIdle = () => set(requestStates.IDLE);
    const setAtPending = () => set(requestStates.PENDING);
    const setAtSuccess = () => set(requestStates.SUCCESS);
    const setAtError = () => set(requestStates.ERROR);

    return {
        errorMsg, setErrorMsg,
        isIdle, isPending, isSuccess, isError,
        setAtIdle, setAtPending, setAtSuccess, setAtError
    };

}

export const keys = {
    shift: {code: 16, name: 'Shift'},
    control: {code: 17, name: 'Control'},
    alt: {code: 18, name: 'Alt'}
};

export function useKeyPressed(key) {

    const [isKeyDown, setIsKeyDown] = useState(false);

    function handleOnKeyDown(e) {
        if (e.keyCode === key.code)
            setIsKeyDown(true);
    }

    function handleOnKeyUp(e) {
        if (e.keyCode === key.code)
            setIsKeyDown(false);
    }

    return {
        ['is' + key.name + 'Down']: isKeyDown,
        ['handleOn' + key.name + 'Up']: handleOnKeyUp,
        ['handleOn' + key.name + 'Down']: handleOnKeyDown
    };
}