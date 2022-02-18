import { entityTypes } from '../helpers';
import React from 'react';
import { SummaryListSmall } from './summaryList';

export function InputObject({metadata, field, defaultValue, useFormFunctions, elKey}) {
    // const logRoot = rootMkr(InputObject, metadata.name);
    // logv(logRoot, {field, defaultValue, '!defaultValue': !defaultValue});
    const property = metadata.properties[field];
    const {hasNull, isMulti} = property;
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];
    const {formState: { errors } } = useFormFunctions;

    // logv(null, {initialId});

    const hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';

    function setHiddenField(value) {
        useFormFunctions.setValue(hiddenFieldName, value, {shouldValidate: true});
    }

    const borderStyle = !!errors[hiddenFieldName] ? {border: '1px solid black'} : null;

    return (
        <>
            <input type={'text'} name={hiddenFieldName} style={{opacity: '0', position: 'absolute'}}
                   {...useFormFunctions.register(hiddenFieldName, property.validation)}
            />
            <SummaryListSmall metadata={entityTypes[property.target]}
                              initialIdList={initialIdList}
                              receiver={'Input'}
                              key={elKey + hiddenFieldName + '_obj'}
                              elKey={elKey + hiddenFieldName + '_obj'}
                              UICues={{hasFocus: false, hasNull, isMulti, borderStyle}}
                              setHiddenField={setHiddenField}
            />
        </>
    );
}
