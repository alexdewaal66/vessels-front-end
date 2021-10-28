import { useDict, setEntryProp } from '../../helpers';

export function useRequestStateDict() {
    const dict = useDict();

    function createRequestState(...keyParts) {
        const key = [...keyParts, Date.now()].join('_');
        dict.add(key, {
                key,
                errorMsg: '',
                setErrorMsg: setEntryProp(dict, key, 'errorMsg'),
                isIdle: true,
                isPending: false,
                isSuccess: false,
                isError: false,

                setAtIdle: () => {
                    dict.set(key, {
                        ...dict.state[key],
                        isIdle: true,
                        isPending: false,
                        isSuccess: false,
                        isError: false,
                    });
                },
                setAtPending: () => {
                    dict.set(key, {
                        ...dict.state[key],
                        isIdle: false,
                        isPending: true,
                        isSuccess: false,
                        isError: false,
                    });
                },
                setAtSuccess: () => {
                    dict.set(key, {
                        ...dict.state[key],
                        isIdle: false,
                        isPending: false,
                        isSuccess: true,
                        isError: false,
                    });
                },
                setAtError: () => {
                    dict.set(key, {
                        ...dict.state[key],
                        isIdle: false,
                        isPending: false,
                        isSuccess: false,
                        isError: true,
                    });
                },
            }
        );
        return dict.state[key];
    }

    function deleteRequestState(requestState) {
        if (requestState)
            dict.del(requestState.key);
    }

    return {createRequestState, deleteRequestState}
}
