import { entityTypes, languageSelector } from '../helpers';
import React, { useEffect, useState } from 'react';
import { SummaryListSmall } from './summaryList';
import { rootMkr, pathMkr, logv, logCondition } from '../dev/log';
import { ValidationMessage } from './ValidationMessage';
import { useCounter } from '../dev/useCounter';
import { Sorry } from '../dev/Sorry';
import { crossFieldExpansion } from '../helpers/crossFieldExpansion';

// import { Value } from '../dev/Value';

// const messages = {NL: {}, EN: {}};

export function InputObject({entityType, fieldName, defaultValue, entityForm, readOnly, elKey}) {
    const logRoot = rootMkr(InputObject, entityType.name, fieldName, readOnly);
    const doLog = logCondition(InputObject, entityType.name, fieldName);
    const typeField = entityType.fields[fieldName];
    if (doLog) logv(logRoot, {field: typeField, defaultValue, '!defaultValue': !defaultValue});
    const {hasNull, isMulti} = typeField;
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];

    // logv(null, {initialId});

    // const hiddenFieldName = 'hidden_' + fieldName + '_' + typeField.target + '_id';
    const hiddenFieldName = fieldName;

    const {register, trigger, setValue, formState: {errors}, getValues} = entityForm;
    useEffect(() => {
        trigger(hiddenFieldName).then();
    }, []);

    // const TXT = messages[languageSelector()];


    function setHiddenField(value) {
        // const logPath = pathMkr(logRoot, setHiddenField, value);
        setValue(hiddenFieldName, value, {shouldValidate: true});
    }

    const borderStyle = !!errors[hiddenFieldName] && !readOnly ? {border: '1px solid black'} : null;

    const counter = useCounter(logRoot, entityType.name, 1000);
    if (counter.passed) return <Sorry context={logRoot} counter={counter}/>;

    function loggingRegister() {
        const logPath = pathMkr(logRoot, loggingRegister);
        const registration = register(hiddenFieldName, crossFieldExpansion(typeField, getValues));
        if (doLog) logv(logPath, {registration});
        return registration;
    }

    return (
        <>
            <input type={'text'} name={hiddenFieldName}
                   defaultValue={defaultValue.id}
                   readOnly={readOnly}
                   style={{opacity: '0', position: 'absolute'}}
                // style={{opacity: '50%'}}
                   {...loggingRegister()}
            />
            <SummaryListSmall entityType={entityTypes[typeField.target]}
                              initialIdList={initialIdList}
                              receiver={'Input'}
                              key={elKey + hiddenFieldName + '_obj'}
                              elKey={elKey + hiddenFieldName + '_obj'}
                              UICues={{hasFocus: false, hasNull, isMulti, borderStyle, readOnly}}
                              setHiddenField={setHiddenField}
            />
            &nbsp;
            {!readOnly && (
                <ValidationMessage form={entityForm} fieldName={hiddenFieldName}/>
            )}
        </>
    );
}
