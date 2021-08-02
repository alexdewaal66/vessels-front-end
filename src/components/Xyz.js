import React, { useState } from 'react';
import { entities } from '../helpers/endpoints';
import { useMountEffect, useRequestState } from '../helpers/customHooks';
import { useForm } from 'react-hook-form';
import {
    addJwtToHeaders, persistentVars, now, range, getRequest, makeRequest
} from '../helpers/utils';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl, Input } from '../formLayouts';
import { SummaryTable } from './SummaryTable';

export function Xyz({id = 1}) {
    const requestListState = useRequestState();
    const requestSelectState = useRequestState();
    const requestEditState = useRequestState();
    const {handleSubmit: handleSelectSubmit, register: registerSelect} = useForm();
    const {handleSubmit: handleEditSubmit, register: registerEdit, reset: resetEdit} = useForm();
    const [list, setList] = useState();
    const [xyz, setXyz] = useState({});
    const [method, setMethod] = useState('put');
    console.log(`xyz=`, xyz);
    const {xyz: metadata} = entities;
    const {endpoint, id: [{name: idName}]} = metadata;

    function updateEditForm(value) {
        setXyz(value);
        resetEdit();
    }

    function fetchXyzList() {
        console.log(now() + ' fetchXyzList()');
        const Jwt = localStorage.getItem(persistentVars.Jwt);
        getRequest({
            url: endpoint,
            headers: addJwtToHeaders({}, Jwt),
            requestState: requestListState,
            onSuccess: setList,
        })
    }

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

    useMountEffect(fetchtSelectedXyz);
    useMountEffect(fetchXyzList);

    function setMethodAsPut() {
        setMethod('put');
    }

    function setMethodAsPost() {
        setMethod('post');
    }

    function setMethodAsDelete() {

    }

    function saveXyz(formdata) {
        let urlId = '';
        if (method === 'put') {
            urlId = `/${formdata.id}`;
        } else {
            delete formdata.id;
        }
        console.log(now() + ' saveXyz()');
        const Jwt = localStorage.getItem(persistentVars.Jwt);
        makeRequest({
            method,
            url: endpoint + urlId,
            headers: addJwtToHeaders({}, Jwt),
            payload: formdata,
            requestState: requestEditState,
            onSuccess: () => {
                setXyz(formdata)
            },
        })
    }

    return (
        <>
            <h4>Xyz</h4>
            <form onChange={handleSelectSubmit(fetchtSelectedXyz)}>
                <Fieldset border={false}>
                    <FieldRow>
                        <FieldDesc>
                            Kies een id:
                        </FieldDesc>
                        <FieldEl>
                            <select name="id"
                                    {...registerSelect("id")}
                                    defaultValue={id}
                            >
                                {range(20).map(i =>
                                    <option key={'xyz_opt_' + i} value={i}>{i}</option>
                                )}
                            </select>
                        </FieldEl>
                    </FieldRow>
                </Fieldset>
            </form>
            {list && (
                <SummaryTable metadata={metadata} list={list} setEntity={setXyz} entityName="xyz" />
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
            <>
                <p>De Xyz is als volgt:</p>
                <Form onSubmit={handleEditSubmit(saveXyz)}>
                    <Fieldset>
                        <input type="hidden" name="id" value={xyz.id} {...registerEdit('id')} />
                        {Object.entries(xyz).map(([k, v]) => (k !== 'id' &&
                                <FieldRow elKey={'xyz_edit_' + k} key={'xyz_edit_' + k}>
                                    <FieldDesc>
                                        {metadata.properties[k]?.label || k}
                                    </FieldDesc>
                                    <FieldEl>
                                        <Input entity="xyz"
                                               field={k}
                                               defaultValue={v || ''}
                                               register={registerEdit}
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
                                    onClick={setMethodAsPut}
                                >
                                    Wijzig
                                </button>
                                <button
                                    type="submit"
                                    className="form-button"
                                    disabled={requestEditState.isPending}
                                    onClick={setMethodAsPost}
                                >
                                    Bewaar als nieuw
                                </button>
                            </FieldEl>
                        </FieldRow>
                    </Fieldset>
                </Form>
            </>
        </>
    );
}

