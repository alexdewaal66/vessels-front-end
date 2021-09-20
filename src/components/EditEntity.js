import React, { useContext, Fragment } from 'react';
import { CommandContext, operationNames, useCommand } from '../contexts/CommandContext';
import { FieldDesc, FieldEl, FieldRow, Fieldset, Form, Input } from '../formLayouts';
import { postRequest, putRequest, deleteRequest } from '../helpers/utils';
import { useRequestState } from '../helpers/customHooks';
import { ShowRequestState } from './ShowRequestState';
import { useForm } from 'react-hook-form';
import { Details } from './Details';
import { OrmContext } from '../contexts/OrmContext';


export function EditEntity({metadata, item, setItem, elKey}) {
    // console.log(`▶▶▶ props=`, {metadata, item, setItem});
    const {rsStatus, setRsStatus, store, loadItem, loadItemsByIds, saveItem, newItem, deleteItem}
        = useContext(OrmContext);

    const [command, setCommand] = useContext(CommandContext);
    const useFormFunctions = useForm();
    const {handleSubmit, register, setValue} = useFormFunctions;
    const requestState = useRequestState();
    const {endpoint} = metadata;
    const readOnly = metadata.methods === 'R';
    // console.log(now() + ` listItem=`, listItem);


    const conditions = {
        entityType: metadata,
        receiver: 'EditEntity',
        operations: {
            edit: (item) => {
                setItem(item);
                useFormFunctions.reset();
            },
        },
    }

    useCommand(conditions, command);

    const issueCommand = {
        put: (formData) => {
            setCommand({
                operation: operationNames.put,
                data: formData,
                entityType: metadata,
                receiver: 'SummaryList',
            })
        },
        post: (formData) => {
            setCommand({
                operation: operationNames.post,
                data: formData,
                entityType: metadata,
                receiver: 'SummaryList',
            })
        },
        delete: (formData) => {
            setCommand({
                operation: operationNames.delete,
                data: formData,
                entityType: metadata,
                receiver: 'SummaryList',
            })
        },
    }


    // function onPut(formData) {
    //     putRequest({
    //         url: `${endpoint}/${formData.id}`,
    //         payload: formData,
    //         requestState: requestState,
    //         onSuccess: () => issueCommand.put(formData),
    //     });
    // }
    function onPut(formData) {
        saveItem(metadata.name, formData);
    }

    // function extractNewId(message, label) {
    //     const parts = message.split(' ');
    //     return (parts[0] === label) ? parseInt(parts[1]) : null;
    // }

    // function onPost(formData) {
    //     postRequest({
    //         url: endpoint,
    //         payload: formData,
    //         requestState: requestState,
    //         onSuccess: (response) => {
    //             issueCommand.post({
    //                 ...formData,
    //                 id: extractNewId(response.data, metadata.label),
    //             });
    //         },
    //     });
    // }
    function onPost(formData) {
        newItem(metadata.name, formData)
    }

    // function onDelete(formData) {
    //     deleteRequest({
    //         url: `${endpoint}/${formData.id}`,
    //         requestState: requestState,
    //         onSuccess: () => issueCommand.delete(formData),
    //     });
    // }
    //
    function onDelete(formData) {
        deleteItem(metadata.name, formData.id)
    }

    function onSubmit({requestMethod, ...formData}) {
        // console.log(now() + ' onSubmit() requestMethod=', requestMethod);
        // console.log(now() + ' onSubmit() formData=', formData);

        // console.log(now() + ' onSubmit()   typeof formData.id =', typeof formData.id);
        //todo: repair datatypes of formData values, for now, just id
        formData.id = +formData.id;
        // Input.js:
        //      const hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';
        const hiddenFieldNames = Object.keys(formData).filter(key => key.split('_')[0] === 'hidden');
        hiddenFieldNames.forEach(hiddenFieldName => {
            const field = hiddenFieldName.split('_')[1];
            if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
                const idValue = formData[hiddenFieldName];
                formData[field] = {id: idValue};
            } else {
                const idList = formData[hiddenFieldName].split(',');
                formData[field] = {id: idList};
            }
            delete formData[hiddenFieldName];
        });
        console.log(`hiddenFields=`, hiddenFieldNames);
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
                const err = `Unsupported requestMethod: '${requestMethod}'`;
                console.log(err);
                requestState.setAtError();
                requestState.setErrorMsg(err);
                return;
        }
    }

    const setRequestMethod = (method) => () => {
        setValue('requestMethod', method);
    };

    return (
        <>
            {item && (
                <div key={elKey + '1'}>
                    <ShowRequestState requestState={requestState}/>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Fieldset border={false}>
                            <input type="hidden"
                                   name="requestMethod"
                                   value="none"
                                   {...register('requestMethod')}
                                   key="requestMethod"
                            />
                            {Object.entries(item).map(([itemPropName, v]) => (
                                    <Fragment key={elKey + ' / FieldRow() ' + itemPropName}>
                                        {/*{console.log('item, k,v:', item, k, v)}*/}
                                        <FieldRow elKey={elKey + ' edit_row ' + itemPropName}
                                                  key={elKey + ' edit_row ' + itemPropName}
                                        >
                                            <FieldDesc
                                                key={elKey + ' edit_desc ' + itemPropName}
                                            >
                                                {metadata.properties[itemPropName]?.label || itemPropName}
                                            </FieldDesc>
                                            <FieldEl>
                                                <Details metadata={metadata} field={itemPropName} value={v} item={item}
                                                         key={elKey + ' edit_details ' + itemPropName}
                                                >
                                                    <Input metadata={metadata}
                                                           field={itemPropName}
                                                           defaultValue={v || ''}
                                                           useFormFunctions={useFormFunctions}
                                                           readOnly={readOnly}
                                                           key={elKey + ` / Input(${itemPropName}=${v})`}
                                                    />
                                                </Details>
                                            </FieldEl>
                                        </FieldRow>
                                    </Fragment>
                                )
                            )}
                            {!readOnly && (
                                <FieldRow>
                                    <FieldEl/>
                                    <FieldEl>
                                        <button type="submit" className="form-button"
                                                disabled={requestState.isPending}
                                                onClick={setRequestMethod('put')}
                                                key="submit_put"
                                        >
                                            Wijzig
                                        </button>
                                        <button type="submit" className="form-button"
                                                disabled={requestState.isPending}
                                                onClick={setRequestMethod('post')}
                                                key="submit_post"
                                        >
                                            Bewaar als nieuw
                                        </button>
                                        <button type="submit" className="form-button"
                                                disabled={requestState.isPending}
                                                onClick={setRequestMethod('delete')}
                                                key="submit_del"
                                        >
                                            Verwijder
                                        </button>
                                    </FieldEl>
                                </FieldRow>
                            )}
                        </Fieldset>
                    </Form>
                </div>
            )}
        </>
    );
}
