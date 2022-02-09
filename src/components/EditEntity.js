import React, { useContext, Fragment } from 'react';
import { CommandContext, operationNames } from '../contexts/CommandContext';
import { FieldDesc, FieldEl, FieldRow, Fieldset, Form, Input } from '../formLayouts';
import { useRequestState } from '../helpers';
import { ShowRequestState } from './ShowRequestState';
import { useForm } from 'react-hook-form';
import { Details, EditButtons } from './';
import { StorageContext } from '../contexts/StorageContext';
import { AuthContext } from '../contexts/AuthContext';
import { logv } from '../dev/log';
import { SummaryListTall } from './summaryList';
import { Stringify } from '../dev/Stringify';


export function EditEntity({metadata, item, setItem, receiver, elKey,}) {
    const entityName = metadata.name;
    const logRoot = EditEntity.name + '() ';
    // logv(logRoot + ` props=`, {metadata, item, setItem});
    const {store, saveItem, newItem, deleteItem} = useContext(StorageContext);
    const {user} = useContext(AuthContext);

    const {useCommand, setCommand} = useContext(CommandContext);
    // const {useObserver, raise} = useContext(ObserverContext);
    const useFormFunctions = useForm();
    const {handleSubmit, register, setValue} = useFormFunctions;
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

    useCommand(conditions);

    function extractDataFromHelpField(hiddenFieldName, formData) {
        const logPath = `📤📤📤📤 ${logRoot} » ${extractDataFromHelpField.name}(${hiddenFieldName})`;
        logv(logPath, {formData});
        const parts = hiddenFieldName.split('_');
        const field = parts[1];
        const target = parts[2];
        if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
            const idValue = +formData[hiddenFieldName];
            logv(null, {target, idValue, '!!idValue': !!idValue});
            if (field.endsWith('Id')) {
                formData[field] = idValue;
            } else {
                formData[field] = !!idValue ? store[target].state[idValue].item : null;
            }
        } else {
            const idList = formData[hiddenFieldName].split(',');
            formData[field] = {id: idList};
        }
        delete formData[hiddenFieldName];
    }

    function onSubmit({requestMethod, ...formData}) {
        const logPath = `🥽🥽 ${logRoot} » ${onSubmit.name}()`;
        logv(logPath, {requestMethod, formData});
        // logv(null, {'typeof formData.id': typeof formData.id});
        //todo: repair datatypes of formData values, for now, just id
        formData.id = +formData.id;
        const hiddenFieldNames = Object.keys(formData).filter(key => key.split('_')[0] === 'hidden');
        hiddenFieldNames.forEach(hiddenFieldName => extractDataFromHelpField(hiddenFieldName, formData));
        // logv(null, {hiddenFieldNames});
        switch (requestMethod) {
            case 'put':
                saveItem(entityName, formData,
                    (item) => {
                        logv(`>>>> ${logPath} » case 'put'`, {item}, 'onSuccess:');
                        setCommand({
                            operation: operationNames.put,
                            data: item,
                            entityType: metadata,
                            receiver: receiver
                        });
                    }
                );
                break;
            case 'post':
                // logv(logPath + ' » case \'post\'', {});
                newItem(entityName, formData,
                    item => {
                        setCommand({
                            operation: operationNames.post,
                            data: item,
                            entityType: metadata,
                            receiver: receiver
                        });
                    }
                );
                break;
            case 'delete':
                //todo: ask confirmation
                deleteItem(entityName, formData.id)
                setCommand({operation: operationNames.delete, data: null, entityType: metadata, receiver: receiver});
                break;
            case 'search':
            //not a useStorage method (yet)
            //
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
        // logv(logPath, {'requestMethod': getValues('requestMethod')});
        setValue('requestMethod', method);
        // logv(null, {'requestMethod': getValues('requestMethod')});
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
                                   value="always"
                                   {...register('requestMethod')}
                                   key="requestMethod"
                            />
                            {/*{Object.entries(item).map(([itemPropName, v]) => (*/}
                            {Object.keys(metadata.properties).map(itemPropName => {
                                    const value = item[itemPropName];
                                    return <Fragment key={elKey + ' / FieldRow() ' + itemPropName}>
                                        {/*{console.log('item, k,v:', item, k, v)}*/}
                                        {!metadata.properties[itemPropName].noEdit && (
                                            <FieldRow elKey={elKey + ' edit_row ' + itemPropName}
                                                      key={elKey + ' edit_row ' + itemPropName}
                                                      field={itemPropName}
                                            >
                                                <FieldDesc
                                                    key={elKey + ' edit_desc ' + itemPropName}
                                                >
                                                    {/*{logv('❌❌❌ EditEntity » render()',*/}
                                                    {/*    {metadata, itemPropName, prop: metadata.properties[itemPropName]}*/}
                                                    {/*), ''}*/}
                                                    {metadata.properties[itemPropName]?.label || itemPropName}
                                                </FieldDesc>
                                                <FieldEl>
                                                    <Details metadata={metadata} field={itemPropName} value={value}
                                                             item={item}
                                                             key={elKey + ' edit_details ' + itemPropName}
                                                    >
                                                        <Input metadata={metadata}
                                                               field={itemPropName}
                                                               defaultValue={value || ''}
                                                               useFormFunctions={useFormFunctions}
                                                               readOnly={readOnly}
                                                               key={elKey + ` / Input(${itemPropName}=${value})`}
                                                        />
                                                    </Details>
                                                </FieldEl>
                                            </FieldRow>
                                        )}

                                    </Fragment>
                                }
                            )}
                            <EditButtons requestState={requestState}
                                         setRequestMethod={setRequestMethod}
                                         readOnly={readOnly}
                            />
                        </Fieldset>
                    </Form>
                </div>
            )}
        </>
    );
}

// export const MemoizedEditEntity = React.memo(EditEntity);
