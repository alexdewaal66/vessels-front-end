import React, { useState } from 'react';
import { entities } from '../helpers/endpoints';
import { useRequestState } from '../helpers/customHooks';
import { useForm } from 'react-hook-form';
import { addJwtToHeaders, persistentVars, now, getRequest } from '../helpers/utils';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl, Input } from '../formLayouts';
import { ShowObject } from '../dev/ShowObject';
import { Stringify } from '../dev/Stringify';

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
            <form onSubmit={handleSubmit(fetchtXyzData)} onChange={handleSubmit(fetchtXyzData)}><Fieldset border={false}>
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
            </form>
            }
            {xyz &&
            <>
                <p>De Xyz is als volgt:</p>
                <Stringify data={xyz}/>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Fieldset>
                        {Object.entries(xyz).map(([k, v]) => (k !== 'id' &&
                                <FieldRow key={'xyz_' + k}>
                                    <FieldDesc>
                                        {entities.xyz.properties[k]?.label || k}
                                    </FieldDesc>
                                    <FieldEl>
                                        <Input entity="xyz"
                                               field={k}
                                               value={v}
                                               register={register}
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
                                    disabled={requestState.isPending}
                                >
                                    Doet nog niks
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

