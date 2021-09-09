import { useDict, useSuperDict, setEntryProp } from './useDict';

export function useRequestStateDict() {
    const dict = useDict();

    function createRequestState(...keyParts) {
        const key = [...keyParts, Date.now()].join('_');
        dict.add(key, {
                //todo: prop key to enable deletion
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
            }
        );
        return dict.state[key];
    }

    //todo: method deleteRequestState(key) {}

    return {createRequestState}
}
