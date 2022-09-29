import { useReducer } from 'react';
// import { logConditionally, logv, rootMkr } from '../dev/log';

const dictActions = {
    add: 'add',
    set: 'set',
    setMany: 'setMany',
    del: 'del',
    delMany: 'delMany',
};

function UseDictException(message) {
    this.message = message;
    this.name = UseDictException.name;
}


const dictReducer = (dictName) => (state, {type, payload: {key, value}}) => {
    // const logPath = pathMkr(logRoot, dictReducer, '↓↓');
    // logv(logPath, {state});
    switch (type) {
        // case dictActions.transformEntry:
        //     const entry = state?.[key];
        //     return {...state, [key]: value(entry)};
        case dictActions.add:
            if (key in state) {
                throw new UseDictException(`can not add new entry ${key} to dict ${dictName}, it already exists`);
            } else {
                return {...state, [key]: value};
            }
        case dictActions.setMany:
            if (typeof value === 'function') {
                return value(state);
            } else {
                return {...state, ...value};
            }
        case dictActions.set:
            if (key in state) {
                let newState;
                if (typeof value === 'function') {
                    const entryCopy = {...state[key]};
                    newState = {...state, [key]: value(entryCopy)};
                } else {
                    newState = {...state, [key]: value};
                }
                return newState;
            } else {
                throw new UseDictException(`can not set entry '${key}' in dict '${dictName}', it doesn't exist`);
            }
        case dictActions.del:
            if (key in state) {
                const copy = {...state};
                delete copy[key];
                return copy;
            } else {
                throw new UseDictException(`can not delete entry ${key} from dict ${dictName}, it doesn't exist`);
            }
        case dictActions.delMany:
            const copy = {...state};
            value.forEach(id => {
                delete copy[id];
            });
            return copy;
        default:
            return state;
    }
}

// function isEmpty(obj) {
//     return Object.keys(obj).length === 0;
// }

export function useDict(dictName, initialState = {}, initializer) {
    // const logRoot = rootMkr(useDict);
    // const doLog = logConditionally(dictName);
    const [state, dispatch] = useReducer(dictReducer(dictName), initialState, initializer);

    // const onStateChange = useRef();

    // function setOnStateChange(callback) {
    //     onStateChange.current = callback;
    // }

    // useEffect(() => {
    //     if (!isEmpty(state)) {
    //         const logPath = pathMkr(logRoot, 'useEffect');
    //         if (doLog) logv(logPath, {dictName, state});
    //         onStateChange.current?.(state);
    //     }
    // }, [state]);

    const getAll = () => state;
    const get = (key) => state[key];
    const add = (key, value) =>
        dispatch({type: dictActions.add, payload: {key, value}});
    const setMany = (value) =>
        dispatch({type: dictActions.setMany, payload: {value}});
    const set = (key, value) =>
        dispatch({type: dictActions.set, payload: {key, value}});
    const del = (key) =>
        dispatch({type: dictActions.del, payload: {key, value: null}});
    const delMany = (value) =>
        dispatch({type: dictActions.delMany, payload: {value}});



    return {
        state, getAll, get, add, setMany, set, del, delMany,
        // setOnStateChange,
    };
}
