import { requestStates } from './remote';

export class RequestState {
    value = requestStates.IDLE;
    errorMsg = '';
    setErrorMsg = (msg) => {
        // logv(pathMkr('RequestState', 'setErrorMsg'), {msg});
        this.errorMsg = msg;
    };

    get isIdle() {
        return (this.value === requestStates.IDLE);
    };

    get isPending() {
        return (this.value === requestStates.PENDING);
    };

    get isSuccess() {
        return (this.value === requestStates.SUCCESS);
    };

    get isError() {
        return (this.value === requestStates.ERROR);
    };

    setAtIdle = () => this.value = requestStates.IDLE;
    setAtPending = () => this.value = requestStates.PENDING;
    setAtSuccess = () => this.value = requestStates.SUCCESS;
    setAtError = () => this.value = requestStates.ERROR;
}
