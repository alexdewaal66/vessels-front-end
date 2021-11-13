import React, { useContext, Fragment } from 'react';
import { CommandContext, operationNames, useCommand } from '../contexts/CommandContext';
import { FieldDesc, FieldEl, FieldRow, Fieldset, Form, Input } from '../formLayouts';
import { useRequestState } from '../helpers';
import { ShowRequestState } from './ShowRequestState';
import { useForm } from 'react-hook-form';
import { Details, EditButtons } from './';
import { StorageContext } from '../contexts/StorageContext';
import { AuthContext } from '../contexts/AuthContext';
import { logv } from '../dev/log';
import { SummaryList } from './summaryList';


export function EditEntity({metadata, item, setItem, elKey}) {
    const logRoot = EditEntity.name + '() ';
    // logv(logRoot + ` props=`, {metadata, item, setItem});
    const {store, saveItem, newItem, deleteItem}
        = useContext(StorageContext);
    const {user} = useContext(AuthContext);

    const [command, setCommand] = useContext(CommandContext);
    const useFormFunctions = useForm();
    const {handleSubmit, register, setValue, getValues} = useFormFunctions;
    const requestState = useRequestState();
    const readOnly = (metadata.methods === 'R') || !user;

    const conditions = {
        entityType: metadata,
        receiver: EditEntity.name,
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
                receiver: SummaryList.name,
            })
        },
        post: (formData) => {
            const logPath = `${logRoot} » issueCommand.post()`;
            logv(logPath, {formData});
            setCommand({
                operation: operationNames.post,
                data: formData,
                entityType: metadata,
                receiver: SummaryList.name,
            })
        },
        delete: (formData) => {
            setCommand({
                operation: operationNames.delete,
                data: formData,
                entityType: metadata,
                receiver: SummaryList.name,
            })
        },
    }

    function extractDataFromHelpField(hiddenFieldName, formData) {
        const logPath = extractDataFromHelpField.name + `(${hiddenFieldName})`;
        logv(logPath, {formData});
        const parts = hiddenFieldName.split('_');
        const field = parts[1];
        const target = parts[2];
        const nullFieldName = 'null_' + field + '_' + target;
        const isNull = !!formData[nullFieldName];
        logv(null, {field, target, nullFieldName, isNull});
        if (isNull) {
            formData[field] = null;
        } else {
            if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
                // logv(null, {nullFieldName, isNull});
                const idValue = formData[hiddenFieldName];
                formData[field] = (idValue === 0) ? null : store[target].state[idValue].item;
            } else {
                const idList = formData[hiddenFieldName].split(',');
                formData[field] = {id: idList};
            }
        }
        delete formData[hiddenFieldName];
        delete formData[nullFieldName];
    }

    function onSubmit({requestMethod, ...formData}) {
        const logPath = `${logRoot} » ${onSubmit.name}()`;
        logv(logPath, {requestMethod, formData});
        // logv(null, {'typeof formData.id': typeof formData.id});
        //todo: repair datatypes of formData values, for now, just id
        formData.id = +formData.id;
        const hiddenFieldNames = Object.keys(formData).filter(key => key.split('_')[0] === 'hidden');
        hiddenFieldNames.forEach(hiddenFieldName => extractDataFromHelpField(hiddenFieldName, formData));
        logv(null, {hiddenFieldNames});
        switch (requestMethod) {
            case 'put':
                saveItem(metadata.name, formData);
                issueCommand.put(formData);
                break;
            case 'post':
                logv(logPath + ' » case \'post\'', {});
                newItem(metadata.name, formData, issueCommand.post);
                // issueCommand.post(formData)
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
        const logPath = logRoot + `setRequestMethod(${method})`;
        logv(logPath, {'requestMethod': getValues('requestMethod')});
        setValue('requestMethod', method);
        logv(null, {'requestMethod': getValues('requestMethod')});
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
                                <EditButtons requestState={requestState} setRequestMethod={setRequestMethod}/>
                            )}
                        </Fieldset>
                    </Form>
                </div>
            )}
        </>
    );
}
