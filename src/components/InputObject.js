import { entityTypes, language } from '../helpers';
import React from 'react';
import { SummaryListSmall } from './summaryList';
import { rootMkr, pathMkr, logv } from '../dev/log';
import { ValidationMessage } from './ValidationMessage';
import { useCounter } from '../dev/useCounter';
import { Sorry } from '../dev/Sorry';

// import { Value } from '../dev/Value';

// const messages = {NL: {}, EN: {}};

export function InputObject({entityType, fieldName, defaultValue, entityForm, readOnly, elKey}) {
    const logRoot = rootMkr(InputObject, entityType.name, fieldName, readOnly);
    // logv(logRoot, {field, defaultValue, '!defaultValue': !defaultValue});
    const field = entityType.fields[fieldName];
    const {hasNull, isMulti} = field;
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];
    const {formState: {errors}} = entityForm;
    // const storage = useStorage();

    // logv(null, {initialId});

    const hiddenFieldName = 'hidden_' + fieldName + '_' + field.target + '_id';

    // const TXT = messages[language()];

    // async
    function setHiddenField(value) {
        // const logPath = pathMkr(logRoot, setHiddenField, value);
        entityForm.setValue(hiddenFieldName, value, {shouldValidate: true});
    }

    const borderStyle = !!errors[hiddenFieldName] && !readOnly ? {border: '1px solid black'} : null;

    const counter = useCounter(logRoot, entityType.name, 100);
    if (counter.passed) return <Sorry context={logRoot} count={counter.value}/>;


    return (
        <>
            <input type={'text'} name={hiddenFieldName}
                   readOnly={readOnly}
                   style={{opacity: '0', position: 'absolute'}}
                // style={{opacity: '50%'}}
                   {...entityForm.register(hiddenFieldName, field.validation)}
            />
            <SummaryListSmall entityType={entityTypes[field.target]}
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
