import React, { useContext, Fragment, useMemo } from 'react';
import { CommandContext, operationNames, StorageContext, AuthContext } from '../contexts';
import { FieldDesc, FieldEl, FieldRow, Fieldset, Form } from '../formLayouts';
import { Input, ShowRequestState, Details, EditButtons } from './';
import { fieldTypes, referringFieldTypes } from '../helpers/globals/entityTypes';
import { text, useRequestState } from '../helpers';
import { useForm } from 'react-hook-form';
import { logCondition, logv, pathMkr, rootMkr } from '../dev/log';
import { hasAccess, authorities, accessPurposes } from '../helpers/globals/levels';
// import { Value } from '../dev/Value';
// import { Stringify } from '../dev';

// const messages = {NL: {}, EN: {}};

function getUserAuthorities(auth, item) {
    if (!auth.user) return;
    const userAuthorities = auth.getRoles();
    if (auth.user.username === item?.username) userAuthorities.push(authorities.SELF);
    return userAuthorities;
}

export function EditEntity(
    {
        entityType, item, setItem, receiver, elKey,
        onlyUpdate
        // submitTime, setSubmitTime
    }) {
    // const containerTop = useRef(null);
    const entityName = entityType.name;
    const logRoot = rootMkr(EditEntity, entityName, '↓↓');
    const doLog = logCondition(EditEntity, entityName);
    // logv(logRoot, {item, receiver: receiver.name});
    const {getItem, saveItem, newItem, deleteItem} = useContext(StorageContext);
    const auth = useContext(AuthContext);

    const {useCommand, setCommand} = useContext(CommandContext);
    const entityForm = useForm({
        mode: 'onChange'
    });
    const {handleSubmit, setValue} = entityForm;
    const requestState = useRequestState();
    const isEligible = useMemo(() => auth.isEligibleToChange(item), [item, auth]);
    // const isEligible = auth.isEligibleToChange(item);
    const userAuthorities = useMemo(() => getUserAuthorities(auth, item), [item, auth]);
    const readOnly = (entityType.methods === 'R') || !auth.user;// || !isEligible;

    // const isSelfOrAdmin = (auth.isAdmin() || auth.user.username === item.username);
    // const typeFields = isSelfOrAdmin ? {...entityType.fields, ...entityType.restrictedFields} : entityType.fields;
    const typeFields = entityType.fields;

    // const TXT = messages[languageSelector()];

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

    // function topIsRendered(element) {
    //     element.current.scrollTop = 0;
    // }

    function extractDataFromHiddenField(fieldName, formData) {
        const logPath = pathMkr(logRoot, extractDataFromHiddenField, fieldName);
        if (doLog) logv(logPath, {fieldName, formData}, '📤📤📤📤');
        const target = typeFields[fieldName].target;
        // if (typeFields[fieldName].isMulti) {
        if (typeFields[fieldName].type === fieldTypes.arr) {
            const ids = formData[fieldName].split(',');
            const items = ids.map(id => getItem(target, id));
            formData[fieldName] = items;
        } else {
            const idValue = +formData[fieldName];
            if (doLog) logv(null, {target, idValue, '!!idValue': !!idValue});
            if (fieldName.endsWith('Id')) {
                formData[fieldName] = idValue;
            } else {
                formData[fieldName] = !!idValue ? getItem(target, idValue) : null;
            }
        }
    }

    function onPut(formData) {
        const logPath = pathMkr(logRoot, onPut);
        if (doLog) logv(logPath, {formData});
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

    function onSubmit(dummy) {
        const logPath = pathMkr(logRoot, onSubmit);
        const {requestMethod, ...formData} = dummy;
        if (doLog)
            logv(logPath, {dummy, requestMethod, formData: {...formData}}, '🔎🔎🔎🔎🔎');

        requestState.setAtPending();
        //todo: repair datatypes of formData values, for now, just id
        formData.id = +formData.id;
        const hiddenFieldNames = Object.keys(formData)
            .filter(key => referringFieldTypes.includes(typeFields[key].type));
        hiddenFieldNames.forEach(hiddenFieldName => extractDataFromHiddenField(hiddenFieldName, formData));
        if (doLog) logv(null, {hiddenFieldNames, formData});
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
    }

    const setRequestMethod = (method) => () => {
        setValue('requestMethod', method);
    };

    // const counter = useCounter(logRoot, entityName, 1000, 50);
    // if (counter.passed) return <Sorry context={logRoot} counter={counter}/>;

    return <>
        {item && (
            <div
                // ref={topIsRendered}
                key={elKey + '1'}>
                <ShowRequestState requestState={requestState}/>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Fieldset border={false}>
                        {/*<input type="text"*/}
                        {/*       name="requestMethod"*/}
                        {/*       key="requestMethod"*/}
                        {/*/>*/}
                        {/*{Object.entries(item).map(([itemPropName, v]) => (*/}
                        {Object.keys(typeFields).map(fieldName => {
                                const typeField = typeFields[fieldName];
                                const value = item[fieldName];
                                if (hasAccess(userAuthorities, typeField?.access)) {
                                    const writeAccess = hasAccess(userAuthorities, typeField?.access, accessPurposes.WRITE);
                                    // if (fieldName === 'roles') logv(logRoot, {userLevels: userAuthorities, typeField, writeAccess, isEligible});
                                    return <Fragment key={elKey + ' / FieldRow() ' + fieldName}>
                                        {/*{console.log('item, k,v:', item, k, v)}*/}
                                        {!typeField.noEdit && (
                                            <FieldRow elKey={elKey + ' edit_row ' + fieldName}
                                                      key={elKey + ' edit_row ' + fieldName}
                                                      field={fieldName}
                                            >
                                                <FieldDesc
                                                    key={elKey + ' edit_desc ' + fieldName}
                                                >
                                                    {/*{logv('❌❌❌ EditEntity » render()',*/}
                                                    {/*    {entityType, fieldName, prop: typeField}*/}
                                                    {/*), ''}*/}
                                                    {text(typeField.label) || fieldName}
                                                </FieldDesc>
                                                <FieldEl>
                                                    <Details entityType={entityType} fieldName={fieldName} value={value}
                                                             item={item}
                                                             key={elKey + ' edit_details ' + fieldName}
                                                    >
                                                        <Input entityType={entityType}
                                                               fieldName={fieldName}
                                                               defaultValue={value || ''}
                                                               entityForm={entityForm}
                                                               isEligible={isEligible}
                                                               readOnly={readOnly || !writeAccess}
                                                               key={elKey + ` / Input(${fieldName}=${value})`}
                                                            // title={'writeAccess=' + writeAccess}
                                                        />
                                                    </Details>
                                                </FieldEl>
                                            </FieldRow>
                                        )}
                                    </Fragment>
                                } else
                                    // return <Stringify data={{fieldName, userAuthorities, access: typeField?.access, value}}/> ;
                                    return null;
                            }
                        )}
                        <EditButtons requestState={requestState}
                                     setRequestMethod={setRequestMethod}
                                     readOnly={readOnly}
                                     isEligible={isEligible}
                                     form={entityForm}
                                     onlyUpdate={onlyUpdate}
                        />
                    </Fieldset>
                </Form>
            </div>
        )}
    </>;
}

