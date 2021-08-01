import React, { useEffect, useState } from 'react';
import { entities } from '../helpers/endpoints';
import { useRequestState } from '../helpers/customHooks';
import { useForm } from 'react-hook-form';
import { addJwtToHeaders, persistentVars, now, getRequest, putRequest } from '../helpers/utils';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl, Input } from '../formLayouts';
// import { ShowObject } from '../dev/ShowObject';
import { Stringify } from '../dev/Stringify';
// import { endpoints } from '../helpers/endpoints';

export function Xyz({id =1 }) {
    const requestSelectState = useRequestState();
    const requestEditState = useRequestState();
    const {handleSubmit: handleSelectSubmit, register: registerSelect} = useForm();
    const {handleSubmit: handleEditSubmit, register: registerEdit, reset: resetEdit} = useForm();
    const [xyz, setXyz] = useState();
    console.log(`xyz=`, xyz);

    function updateEditForm(value) {
        setXyz(value);
        resetEdit();
    }

    function fetchtSelectedXyz(formdata) {
        console.log(now() + ' fetchtSelectedXyz()');
        console.log(`formdata=`, formdata);
        const Jwt = localStorage.getItem(persistentVars.Jwt);
        const xyzId = formdata?.id || id;
        getRequest({
            url: `${entities.xyz.endpoint}/${xyzId}`,
            headers: addJwtToHeaders({}, Jwt),
            requestState: requestSelectState,
            onSuccess: updateEditForm,
        })
    }

    function saveXyz(formdata) {
        // C, R or U?
        console.log(now() + ' saveXyz()');
        const Jwt = localStorage.getItem(persistentVars.Jwt);
        putRequest({
            url: `${entities.xyz.endpoint}/${formdata.id}`,
            headers: addJwtToHeaders({}, Jwt),
            payload: formdata,
            requestState: requestEditState,
            onSuccess: () => { setXyz(formdata) },
        })
    }

    useEffect(fetchtSelectedXyz, []);
    // useEffect(fetchtSelectedXyz, [requestSelectState]); // LOOPS

    return (
        <>
            <p>Xyz</p>
            <form onSubmit={handleSelectSubmit(fetchtSelectedXyz)} onChange={handleSelectSubmit(fetchtSelectedXyz)}><Fieldset border={false}>
                <FieldRow>
                    <FieldDesc>
                        Kies een id:
                    </FieldDesc>
                    <FieldEl>
                        <select name="id"
                                {...registerSelect("id")}
                            defaultValue={id}
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </FieldEl>
                </FieldRow>
                <FieldRow>
                    <FieldEl>
                        <button
                            type="submit"
                            className="form-button"
                            disabled={requestSelectState.isPending}
                        >
                            Haal gegevens op
                        </button>
                    </FieldEl>
                </FieldRow>
            </Fieldset>
            </form>


            {xyz &&
            <>
                <p>De Xyz is als volgt:</p>
                <Stringify data={xyz} />
                <Form onSubmit={handleEditSubmit(saveXyz)}>
                    <Fieldset>
                        <input type="hidden" name="id" value={xyz.id} {...registerEdit('id')} />
                        {Object.entries(xyz).map(([k, v]) => (k !== 'id' &&
                                <FieldRow key={'xyz_' + k}>
                                    <FieldDesc>
                                        {entities.xyz.properties[k]?.label || k}
                                    </FieldDesc>
                                    <FieldEl>
                                        <Input entity="xyz"
                                               field={k}
                                               defaultValue={v}
                                               register={registerEdit}
                                        />
                                    </FieldEl>
                                </FieldRow>
                            )
                        )}
                        <FieldRow>
                            <FieldEl>
                                <button
                                    type="submit"
                                    className="form-button"
                                    disabled={requestEditState.isPending}
                                >
                                    Bewaar
                                </button>
                            </FieldEl>
                        </FieldRow>
                    </Fieldset>
                </Form>
            </>
            }

        </>
    );
}

