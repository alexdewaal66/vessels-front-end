export function useFakeRequestState(initialValue) {
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
        errorMsg, setErrorMsg,
        isIdle, isPending, isSuccess, isError,
        setAtIdle, setAtPending, setAtSuccess, setAtError
    };

}
