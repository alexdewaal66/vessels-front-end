import { requestStates } from './utils';
import { useDict, useSuperDict, setEntryProp } from './useDict';
import { set } from 'react-hook-form';

class RequestEntry {
    constructor(dict, key) {
    }
}

export function useRequestStateDict() {
    const dict = useDict();

    function createRequestState(...keyParts) {
        const key = [...keyParts, Date.now()].join('_');
        dict.add(key, {
                // value: requestStates.IDLE,
                // set: setEntryProp(dict, key, 'value'),
                errorMsg: '',
                setErrorMsg: setEntryProp(dict, key, 'errorMsg'),
                isIdle    : true,
                isPending : false,
                isSuccess : false,
                isError   : false,

                setAtIdle: () => {
                    dict.set(key, {...dict.state[key],
                        isIdle    : true,
                        isPending : false,
                        isSuccess : false,
                        isError   : false,
                    });
                },
                setAtPending: () => {
                    dict.set(key, {...dict.state[key],
                        isIdle    : false,
                        isPending : true,
                        isSuccess : false,
                        isError   : false,
                    });
                },
                setAtSuccess: () => {
                    dict.set(key, {...dict.state[key],
                        isIdle    : false,
                        isPending : false,
                        isSuccess : true,
                        isError   : false,
                    });
                },
                setAtError: () => {
                    dict.set(key, {...dict.state[key],
                        isIdle    : false,
                        isPending : false,
                        isSuccess : false,
                        isError   : true,
                    });
                },
            } //todo? replace this with new RequestEntry(dict,key)
        );
        return dict.state[key];
    }

    const isPending = (key) => (dict.state[key] === requestStates.PENDING);
    const isIdle = (key) => (dict.state[key] === requestStates.IDLE);
    const isSuccess = (key) => (dict.state[key] === requestStates.SUCCESS);
    const isError = (key) => (dict.state[key] === requestStates.ERROR);

    const setErrorMsg = (key, msg) => {
        dict.set(key, {value: dict.state[key].value, errorMsg: msg})
    }

    const setAtIdle = (key) => {
        dict.set(key, {value: requestStates.IDLE, errorMsg: ''})
    };
    const setAtPending = (key) => {
        dict.set(key, {value: requestStates.PENDING, errorMsg: ''})
    };
    const setAtSuccess = (key) => {
        dict.set(key, {value: requestStates.SUCCESS, errorMsg: ''})
    };
    const setAtError = (key) => {
        dict.set(key, {value: requestStates.ERROR, errorMsg: ''})
    };

    return {createRequestState}
}
