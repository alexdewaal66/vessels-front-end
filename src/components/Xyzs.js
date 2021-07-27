import React, { useState } from 'react';
import { entities } from '../helpers/endpoints';
import { useRequestState } from '../helpers/customHooks';
import { addJwtToHeaders, persistentVars, now, getRequest } from '../helpers/utils';

export function Xyzs({id}) {
const requestState = useRequestState();
const [xyz, setXyz] = useState();

function fetchtXyzData() {
    console.log(now() + ' fetchtXyzData()');
    const token = localStorage.getItem(persistentVars.JWT);
    getRequest({
        url: entities.xyzs.endpoint,
        headers: addJwtToHeaders({}, token),
        requestState: requestState,
        onSuccess: setXyz,
    })
}

    return (
        <>
            <p>Xyz</p>

        </>
    );
}

