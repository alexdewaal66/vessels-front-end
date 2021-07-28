import React, { useState } from 'react';
import { entities } from '../helpers/endpoints';
import { useRequestState } from '../helpers/customHooks';
import { useForm } from 'react-hook-form';
import { addJwtToHeaders, persistentVars, now, getRequest } from '../helpers/utils';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl, Input } from '../formLayouts';

export function Xyzs({id}) {
    const {handleSubmit, register} = useForm();
    const requestState = useRequestState();
    const [xyz, setXyz] = useState();
    console.log(`xyz=`, xyz);

    function fetchtXyzData(formdata) {
        console.log(now() + ' fetchtXyzData()');
        console.log(`formdata=`, formdata);
        const token = localStorage.getItem(persistentVars.JWT);
        getRequest({
            url: `${entities.xyz.endpoint}/${formdata.xyzId}`,
            headers: addJwtToHeaders({}, token),
            requestState: requestState,
            onSuccess: setXyz,
        })
    }

    function onSubmit(formdata) {
        // C, R or U?
    }

    return (
        <>
            <p>Xyz</p>
            {!id &&
            <Form onChange={handleSubmit(fetchtXyzData)}><Fieldset border={false}>
                <FieldRow>
                    <FieldDesc>
                        Kies een id:
                    </FieldDesc>
                    <FieldEl>
                        <select name="xyzId"
                                {...register("xyzId")}
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
                            disabled={requestState.isPending}
                        >
                            Haal gegevens op
                        </button>
                    </FieldEl>
                </FieldRow>
            </Fieldset>
            </Form>
            }
            {xyz &&
            <>
                <p>De Xyz is als volgt:</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Fieldset>
                        {Object.entries(xyz).map(([k, v]) => (k !== 'id' &&
                                <FieldRow key={'xyz_' + k}>
                                    <FieldDesc>
                                        {entities.xyz.properties[k]?.label || k}
                                    </FieldDesc>
                                    <FieldEl>
                                        {/*<input*/}
                                        {/*    type="text" size={entities.xyz.properties[k]?.validation.maxLength || 50}*/}
                                        {/*    name={k}*/}
                                        {/*    {...register(k, entities.xyz.properties[k]?.validation)}*/}
                                        {/*    value={v}*/}
                                        {/*/>*/}
                                        <Input entity="xyz"
                                               field={k}
                                               value={v}
                                               register={register}
                                        />
                                    </FieldEl>
                                </FieldRow>
                            )
                        )}
                    </Fieldset>
                </Form>
            </>
            }

        </>
    );
}

