import React, { useState } from 'react';
import { entities } from '../helpers/endpoints';
import { useMountEffect, useRequestState } from '../helpers/customHooks';
import { useForm } from 'react-hook-form';
import {
    addJwtToHeaders, persistentVars, now, getRequest
} from '../helpers/utils';
import { SummaryTable } from './SummaryTable';
import { EditEntity } from './EditEntity';

export function Xyz({id = 0}) {
    const requestListState = useRequestState();
    const useFormFunctions = useForm();
    const [list, setList] = useState(null);
    const [xyz, setXyz] = useState(null);
    console.log(`xyz=`, xyz);
    const {xyz: metadata} = entities;
    const {endpoint, id: [{name: idName}]} = metadata;

    //todo: move fetchXyzList() and useMountEffect() to new SummaryList component

    function updateList(newList, selectedId = id) {
        console.log(now() + ` updateList() selectedId=`, selectedId);
        newList.sort((a, b) => a.id - b.id);
        setList(newList);
        // let index = newList.findIndex(item => item.id === selectedId);
        // index = (index !== -1) ? index : 0;
        // setXyz(newList[index]);
        const selectedXyz = newList.find(item => item.id === selectedId);
        updateEditForm(selectedXyz || newList[0]);
    }

    function fetchXyzList() {
        console.log(now() + ' fetchXyzList()');
        const Jwt = localStorage.getItem(persistentVars.JWT);
        getRequest({
            url: endpoint,
            headers: addJwtToHeaders({}, Jwt),
            requestState: requestListState,
            onSuccess: (response) => updateList(response.data),
        })
    }

    useMountEffect(fetchXyzList);

    function updateEditForm(changedXyz) {
        setXyz(changedXyz);
        useFormFunctions.reset();
    }

    const onChange = {
        update: (formData) => {
            const index = list.findIndex(item => item.id === formData.id);
            console.log(now() + ` onChange.update() index=`, index);
            const newList = [...list.slice(0, index), formData, ...list.slice(index + 1)];
            updateList(newList, formData.id);
        },
        create: (formData) => {
            const newList = [...list, formData];
            updateList(newList, formData.id);
        },
        delete: (formData) => {
            const index = list.findIndex(item => item.id === formData.id);
            const newList = [...list.slice(0, index), ...list.slice(index + 1)];
            updateList(newList);
        },
    }

    return (
        <>
            <h4>Xyz</h4>
            {list && (
                    <SummaryTable metadata={metadata}
                                  list={list}
                                  setEntity={updateEditForm}
                                  entityName="xyz"
                    />
            )}
            <>{(xyz?.id || list) && (
                <EditEntity entity={xyz || list[0]}
                            useFormFunctions={useFormFunctions}
                            // updateList={updateList2}
                            metadata={metadata}
                            onChange={onChange}
                />
            )}
            </>
        </>
    );
}

