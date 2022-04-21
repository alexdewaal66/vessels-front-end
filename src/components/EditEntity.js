import React, { useContext, Fragment } from 'react';
import { CommandContext, operationNames, StorageContext, AuthContext } from '../contexts';
import { FieldDesc, FieldEl, FieldRow, Fieldset, Form } from '../formLayouts';
import { Input, ShowRequestState, Details, EditButtons } from './';
import { useRequestState } from '../helpers';
import { useForm } from 'react-hook-form';
// import { logv, rootMkr, pathMkr } from '../dev/log';
// import { Value } from '../dev/Value';
// import { Stringify } from '../dev';

export function EditEntity(
    {
        entityType, item, setItem, receiver, elKey,
        // submitTime, setSubmitTime
    }) {
    const entityName = entityType.name;
    // const logRoot = rootMkr(EditEntity, entityType.name, '↓↓');
    // logv(logRoot, {item, receiver: receiver.name});
    const {getItem, saveItem, newItem, deleteItem} = useContext(StorageContext);
    const auth = useContext(AuthContext);

    const {useCommand, setCommand} = useContext(CommandContext);
    const entityForm = useForm({
        mode: 'onChange'
    });
    const {handleSubmit, setValue} = entityForm;
    const requestState = useRequestState();
    const readOnly = (entityType.methods === 'R') || !auth.user;
    const isEligible = auth.isEligibleToChange(item);

    const conditions = {
        entityType: entityType,
        receiver: EditEntity.name,
        operations: {
            edit: (item) => {
                setItem(item);
                entityForm.reset();
            },
        },
    }

    useCommand(conditions);

    function extractDataFromHelpField(hiddenFieldName, formData) {
        // const logPath = pathMkr(logRoot, extractDataFromHelpField, hiddenFieldName);
        // logv(logPath, {formData}, '📤📤📤📤');
        const parts = hiddenFieldName.split('_');
        const field = parts[1];
        const target = parts[2];
        if (hiddenFieldName.split('_').splice(-1)[0] === 'id') {
            const idValue = +formData[hiddenFieldName];
            // logv(null, {target, idValue, '!!idValue': !!idValue});
            if (field.endsWith('Id')) {
                formData[field] = idValue;
            } else {
                // formData[field] = !!idValue ? store[target].state[idValue].item : null;
                formData[field] = !!idValue ? getItem(target, idValue) : null;
            }
        } else {
            const idList = formData[hiddenFieldName].split(',');
            formData[field] = {id: idList};
        }
        delete formData[hiddenFieldName];
    }

    function onPut(formData) {
        saveItem(entityName, formData,
            () => {
                // logv(logPath + ` » case 'put'`, {item}, 'onSuccess:');
                setCommand({
                    operation: operationNames.put,
                    data: formData,
                    entityType,
                    receiver
                });
                requestState.setAtSuccess();
            },
            requestState.setAtError
        );
    }

    function onPost(formData) {
        // logv(logPath + ` » case 'post'`);
        newItem(entityName, formData,
            () => {
                setCommand({
                    operation: operationNames.post,
                    data: formData,
                    entityType,
                    receiver,
                    requestState
                });
                requestState.setAtSuccess();
            },
            requestState.setAtError
        );
    }

    function onDelete(formData) {
        //todo: ask confirmation
        deleteItem(entityName, formData.id,
            () => {
                setCommand({
                    operation: operationNames.delete,
                    data: null,
                    entityType,
                    receiver,
                    requestState
                });
                requestState.setAtSuccess();
            },
            requestState.setAtError
        );
    }

    // function onSearch(formData) {}

    function onSubmit({requestMethod, ...formData}) {
        // const logPath = pathMkr(logRoot, onSubmit);
        // logv(logPath, {requestMethod, formData});
        // logv(null, {'typeof formData.id': typeof formData.id});

        // setSubmitTime(now());
        requestState.setAtPending();
        //todo: repair datatypes of formData values, for now, just id
        formData.id = +formData.id;
        const hiddenFieldNames = Object.keys(formData).filter(key => key.split('_')[0] === 'hidden');
        hiddenFieldNames.forEach(hiddenFieldName => extractDataFromHelpField(hiddenFieldName, formData));
        // logv(null, {hiddenFieldNames});
        switch (requestMethod) {
            case 'put':
                onPut(formData);
                break;
            case 'post':
                onPost(formData);
                break;
            case 'delete':
                onDelete(formData);
                break;
            // case 'search': not a useStorage method (yet)
            default:
                const err = `Unsupported requestMethod: '${requestMethod}'`;
                console.error(err);
                requestState.setAtError();
                requestState.setErrorMsg(err);
                return;
        }
        // requestState.setAtSuccess();
    }

    const setRequestMethod = (method) => () => {
        // const logPath = pathMkr(logRoot, setRequestMethod);
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
                            {/*<input type="text"*/}
                            {/*       name="requestMethod"*/}
                            {/*       key="requestMethod"*/}
                            {/*/>*/}
                            {/*{Object.entries(item).map(([itemPropName, v]) => (*/}
                            {Object.keys(entityType.properties).map(itemPropName => {
                                    const value = item[itemPropName];
                                    return <Fragment key={elKey + ' / FieldRow() ' + itemPropName}>
                                        {/*{console.log('item, k,v:', item, k, v)}*/}
                                        {!entityType.properties[itemPropName].noEdit && (
                                            <FieldRow elKey={elKey + ' edit_row ' + itemPropName}
                                                      key={elKey + ' edit_row ' + itemPropName}
                                                      field={itemPropName}
                                            >
                                                <FieldDesc
                                                    key={elKey + ' edit_desc ' + itemPropName}
                                                >
                                                    {/*{logv('❌❌❌ EditEntity » render()',*/}
                                                    {/*    {entityType, itemPropName, prop: entityType.properties[itemPropName]}*/}
                                                    {/*), ''}*/}
                                                    {entityType.properties[itemPropName]?.label || itemPropName}
                                                </FieldDesc>
                                                <FieldEl>
                                                    <Details entityType={entityType} field={itemPropName} value={value}
                                                             item={item}
                                                             key={elKey + ' edit_details ' + itemPropName}
                                                    >
                                                        <Input entityType={entityType}
                                                               field={itemPropName}
                                                               defaultValue={value || ''}
                                                               entityForm={entityForm}
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
                                         isEligible={isEligible}
                                         form={entityForm}
                            />
                        </Fieldset>
                    </Form>
                </div>
            )}
        </>
    );
}

