import React, { useContext, Fragment } from 'react';
import { CommandContext, operationNames, useCommand } from '../contexts/CommandContext';
import { FieldDesc, FieldEl, FieldRow, Fieldset, Form, Input } from '../formLayouts';
import { postRequest, putRequest, deleteRequest, now } from '../helpers/utils';
import { useRequestState } from '../helpers/customHooks';
import { ShowRequestState } from './ShowRequestState';
import { useForm } from 'react-hook-form';
import { Details } from './Details';
import { StorageContext } from '../contexts/StorageContext';


export function EditEntity({metadata, item, setItem, elKey}) {
    // console.log(`▶▶▶ props=`, {metadata, item, setItem});
    const {store, saveItem, newItem, deleteItem, getItem}
        = useContext(StorageContext);

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


    function onSubmit({requestMethod, ...formData}) {
        // console.log(`${now()} \n\t EditEntity(${metadata.name}) » onSubmit() \n\t requestMethod=`, requestMethod);
        console.log(`❗ ${now()}\n EditEntity(${metadata.name}) » onSubmit() \n\t formData=`, formData);

        // console.log(now() + ' EditEntity(${metadata.name}) » onSubmit() \n\t typeof formData.id =', typeof formData.id);
        //todo: repair datatypes of formData values, for now, just id
        formData.id = +formData.id;
        const hiddenFieldNames = Object.keys(formData).filter(key => key.split('_')[0] === 'hidden');
        hiddenFieldNames.forEach(hiddenFieldName => {
            const parts = hiddenFieldName.split('_');
            const field = parts[1];
            const target = parts[2];
            const nullFieldName = 'null_' + field + '_' + target;
            const isNull = !!formData[nullFieldName];
            if (isNull) {
                formData[field] = null;
            } else {
                if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
                    // console.log(now() + ` EditEntity(${metadata.name}) » onSubmit`, `\n\t nullFieldName=`, nullFieldName, `\n\t isNull`, isNull);
                    const idValue = formData[hiddenFieldName];
                    formData[field] = (idValue === 0) ? null : store[target].state[idValue].item;
                } else {
                    const idList = formData[hiddenFieldName].split(',');
                    formData[field] = {id: idList};
                }
            }
            delete formData[hiddenFieldName];
            delete formData[nullFieldName];
        });
        console.log(`hiddenFields=`, hiddenFieldNames);
        switch (requestMethod) {
            case 'put':
                saveItem(metadata.name, formData);
                break;
            case 'post':
                newItem(metadata.name, formData)
                break;
            case 'delete':
                //todo: ask confirmation
                deleteItem(metadata.name, formData.id)
                break;
            default:
                const err = `Unsupported requestMethod: '${requestMethod}'`;
                console.error(err);
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
                                                  field={itemPropName}
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
                                                accessKey={'w'}
                                        >
                                            Wijzig
                                        </button>
                                        <button type="submit" className="form-button"
                                                disabled={requestState.isPending}
                                                onClick={setRequestMethod('post')}
                                                key="submit_post"
                                                accessKey={'n'}
                                        >
                                            Maak nieuw
                                        </button>
                                        <button type="submit" className="form-button"
                                                disabled={requestState.isPending}
                                                onClick={setRequestMethod('delete')}
                                                key="submit_del"
                                                accessKey={'v'}
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
