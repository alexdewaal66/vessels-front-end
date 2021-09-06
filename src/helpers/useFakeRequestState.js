import { requestStates } from './utils';

export function useFakeRequestState(initialValue) {
    const value = 'useFakeRequestState';
    const errorMsg = 'useFakeRequestState'
    const setErrorMsg = () => {
    };

    const isIdle = false;
    const isPending = false;
    const isSuccess = false;
    const isError = false;

    const setAtIdle = () => {
    };
    const setAtPending = () => {
    };
    const setAtSuccess = () => {
    };
    const setAtError = () => {
    };

    return {
        value, errorMsg, setErrorMsg,
        isIdle, isPending, isSuccess, isError,
        setAtIdle, setAtPending, setAtSuccess, setAtError
    };

}
