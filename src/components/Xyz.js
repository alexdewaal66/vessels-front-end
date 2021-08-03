import React, { useState, useEffect } from 'react';
import { entities } from '../helpers/endpoints';
import { useMountEffect, useRequestState } from '../helpers/customHooks';
import { useForm } from 'react-hook-form';
import {
    addJwtToHeaders, persistentVars, now, range, getRequest, makeRequest
} from '../helpers/utils';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl, Input } from '../formLayouts';
import { SummaryTable } from './SummaryTable';

export function Xyz({id = 0}) {
    const requestListState = useRequestState();
    const requestEditState = useRequestState();
    const editEntity = useForm();
    const { handleSubmit, register, reset, setValue} = editEntity;
    const [list, setList] = useState(null);
    const [xyz, setXyz] = useState({});
    console.log(`xyz=`, xyz);
    const {xyz: metadata} = entities;
    const {endpoint, id: [{name: idName}]} = metadata;

    function fetchXyzList() {
        console.log(now() + ' fetchXyzList()');
        const Jwt = localStorage.getItem(persistentVars.Jwt);
        getRequest({
            url: endpoint,
            headers: addJwtToHeaders({}, Jwt),
            requestState: requestListState,
            onSuccess: (response) => setList(response.data),
        })
    }


    useMountEffect(fetchXyzList);

    function updateEditForm(changedXyz) {
        setXyz(changedXyz);
        reset();
    }

    function onEditResponse(response) {
        // setXyz(formData);
        console.log(now() + ' onEditResponse()\n\tresponse=', response);
        updateEditForm(response.data);
    }

    function onEditSubmit({requestMethod, ...formData}) {
        console.log(now() + ' onSubmit()');
        console.log(`requestMethod=`, requestMethod);
        console.log(`formData=`, formData);
        let url = endpoint;
        switch (requestMethod) {
            case 'put':
                url += `/${formData.id}`;
                break;
            case 'delete':
                url += `/${formData.id}`;
                formData = null;
                break;
            case 'post':
                delete formData.id;
                break;
            default:
                const err = `Unsupported method: '${requestMethod}'`;
                console.log(err);
                requestEditState.setAtError();
                requestEditState.errorMsg = err;
                return;
        }
        const Jwt = localStorage.getItem(persistentVars.Jwt);
        makeRequest({
            method: requestMethod,
            url,
            headers: addJwtToHeaders({}, Jwt),
            payload: formData,
            requestState: requestEditState,
            onSuccess: onEditResponse,
        })
    }

    return (
        <>
            <h4>Xyz</h4>
            {list && (
                <SummaryTable metadata={metadata} list={list} setEntity={updateEditForm} entityName="xyz"/>
            )}
            {/*<Stringify data={list}/>*/}
            {requestEditState.isPending && (
                <>
                    Even geduld a.u.b.
                </>
            )}
            {requestEditState.isError && (
                <>
                    Er is iets fout gegaan ({requestEditState.errorMsg})
                </>
            )}
            {requestEditState.isSuccess && (
                <>
                    De gegevens zijn bewaard
                </>
            )}
            <>{xyz?.id  && (
                <>
                    <p>Details {'#' + xyz.id}:</p>
                    <Form onSubmit={handleSubmit(onEditSubmit)}>
                        <Fieldset>
                            <input type="hidden" name="id" value={xyz?.id} {...register('id')} />
                            <input type="hidden" name="requestMethod" value="none" {...register('requestMethod')} />
                            {Object.entries(xyz).map(([k, v]) => (k !== 'id' &&
                                    <FieldRow elKey={'xyz_edit_' + k} key={'xyz_edit_' + k}>
                                        <FieldDesc>
                                            {metadata.properties[k]?.label || k}
                                        </FieldDesc>
                                        <FieldEl>
                                            <Input entity="xyz"
                                                   field={k}
                                                   defaultValue={v || ''}
                                                   register={register}
                                            />
                                        </FieldEl>
                                    </FieldRow>
                                )
                            )}
                            <FieldRow>
                                <FieldEl>
                                </FieldEl>
                                <FieldEl>
                                    <button
                                        type="submit"
                                        className="form-button"
                                        disabled={requestEditState.isPending}
                                        onClick={() => setValue('requestMethod', 'put')}
                                    >
                                        Wijzig
                                    </button>
                                    <button
                                        type="submit"
                                        className="form-button"
                                        disabled={requestEditState.isPending}
                                        onClick={() => setValue('requestMethod', 'post')}
                                    >
                                        Bewaar als nieuw
                                    </button>
                                    <button
                                        type="submit"
                                        className="form-button"
                                        disabled={requestEditState.isPending}
                                        onClick={() => setValue('requestMethod', 'delete')}
                                    >
                                        Verwijder
                                    </button>
                                </FieldEl>
                            </FieldRow>
                        </Fieldset>
                    </Form>
                </>
            )}
            </>
        </>
    );
}


/*
    const requestSelectState = useRequestState();

    function fetchtSelectedXyz(formdata) {
        console.log(now() + ' fetchtSelectedXyz()');
        console.log(`formdata=`, formdata);
        const xyzId = formdata?.id || id;
        if (xyzId === '0') {
            fetchXyzList();
            return;
        }
        const Jwt = localStorage.getItem(persistentVars.Jwt);
        getRequest({
            url: `${endpoint}/${xyzId}`,
            headers: addJwtToHeaders({}, Jwt),
            requestState: requestSelectState,
            onSuccess: updateEditForm,
        })
    }

 */