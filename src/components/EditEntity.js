import React from 'react';
import { FieldDesc, FieldEl, FieldRow, Fieldset, Form, Input } from '../formLayouts';
import { postRequest, putRequest, deleteRequest, now } from '../helpers/utils';
import { useRequestState } from '../helpers/customHooks';
import { ShowRequestState } from './ShowRequestState';
import { ShowObject } from '../dev/ShowObject';

export function EditEntity({item, useFormFunctions, metadata, onChange}) {
    const {handleSubmit, register, setValue} = useFormFunctions;
    const requestState = useRequestState();
    const {endpoint, id: [{name: idName}]} = metadata;
    const readOnly = metadata.methods === 'R';
    // console.log(now() + ` item=`, item);

    function onPut(formData) {
        // console.log(now() + ' onPut() formData=', formData);
        putRequest({
            url: `${endpoint}/${formData.id}`,
            payload: formData,
            requestState: requestState,
            onSuccess: () => onChange.update(formData),
        });
    }

    function extractNewId(message, label) {
        const parts = message.split(' ');
        return (parts[0] === label) ? parseInt(parts[1]) : null;
    }

    function onPost(formData) {
        // console.log(now() + ' onPost() formData=', formData);
        postRequest({
            url: endpoint,
            payload: formData,
            requestState: requestState,
            onSuccess: (response) => {
                onChange.create({
                    ...formData,
                    id: extractNewId(response.data, metadata.label),
                });
            },
        });
    }

    function onDelete(formData) {
        // console.log(now() + ' onDelete() formData=', formData);
        deleteRequest({
            url: `${endpoint}/${formData.id}`,
            requestState: requestState,
            onSuccess: () => onChange.delete(formData),
        });
    }

    function onSubmit({requestMethod, ...formData}) {
        // console.log(now() + ' onSubmit() requestMethod=', requestMethod);
        // console.log(now() + ' onSubmit() formData=', formData);

        // console.log(now() + ' onSubmit()   typeof formData.id =', typeof formData.id);
        //todo: repair datatypes of formData values, for now, just id
        formData.id = +formData.id;
        switch (requestMethod) {
            case 'put':
                onPut(formData);
                break;
            case 'post':
                onPost(formData);
                break;
            case 'delete':
                //todo: ask confirmation
                onDelete(formData);
                break;
            default:
                const err = `Unsupported method: '${requestMethod}'`;
                console.log(err);
                requestState.setAtError();
                requestState.errorMsg = err;
                return;
        }
    }

    const setRequestMethod = (method) => () => {
        setValue('requestMethod', method);
    };

    return (
        <>{item && (
            <>
                <ShowRequestState requestState={requestState}/>
                <p>Details {'#' + item.id}:</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Fieldset border={false}>
                        <input type="hidden"
                               name="id"
                               value={item?.id}
                               {...register('id')}
                        />
                        <input type="hidden"
                               name="requestMethod"
                               value="none"
                               {...register('requestMethod')}
                        />
                        {Object.entries(item).map(([k, v]) => (k !== 'id' &&
                                <FieldRow elKey={idName + '_edit_' + k}
                                          key={idName + '_edit_' + k}
                                >
                                    <FieldDesc>
                                        {metadata.properties[k]?.label || k}
                                    </FieldDesc>
                                    <FieldEl>
                                        <Input metadata={metadata}
                                               field={k}
                                               defaultValue={v || ''}
                                               register={register}
                                        />
                                    </FieldEl>
                                </FieldRow>
                            )
                        )}
                        {!readOnly && (
                            <FieldRow>
                                <FieldEl>
                                </FieldEl>
                                <FieldEl>
                                    <button type="submit" className="form-button"
                                            disabled={requestState.isPending}
                                            onClick={setRequestMethod('put')}
                                    >
                                        Wijzig
                                    </button>
                                    <button type="submit" className="form-button"
                                            disabled={requestState.isPending}
                                            onClick={setRequestMethod('post')}
                                    >
                                        Bewaar als nieuw
                                    </button>
                                    <button type="submit" className="form-button"
                                            disabled={requestState.isPending}
                                            onClick={setRequestMethod('delete')}
                                    >
                                        Verwijder
                                    </button>
                                </FieldEl>
                            </FieldRow>
                        )}
                    </Fieldset>
                </Form>

            </>
        )}
        </>
    );
}
