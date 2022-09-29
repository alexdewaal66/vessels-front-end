import { useReducer, useState } from 'react';
import { useStaticObject } from '../helpers/useStaticObject';
import { useMountEffect } from '../helpers/customHooks';
// import { logConditionally, logv, rootMkr } from '../dev/log';

export function useDict2(dictName, initialState = {}) {
    // const logRoot = rootMkr(useDict2);
    // const doLog = logConditionally(dictName);

    const container = useStaticObject(initialState);

    const [state, setState] = useState(null);

    function forceUpdate() {
        setState({...container[null]});
    }

    useMountEffect(forceUpdate);

    return {state, forceUpdate};
}
