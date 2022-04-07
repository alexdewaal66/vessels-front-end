import { entityTypes } from '../helpers';
import React from 'react';
import { SummaryListSmall } from './summaryList';

export function InputObject({entityType, field, defaultValue, EditEntityFormFunctions, readOnly, elKey}) {
    // const logRoot = rootMkr(InputObject, entityType.name);
    // logv(logRoot, {field, defaultValue, '!defaultValue': !defaultValue});
    const property = entityType.properties[field];
    const {hasNull, isMulti} = property;
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];
    const {formState: { errors } } = EditEntityFormFunctions;

    // logv(null, {initialId});

    const hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';

    function setHiddenField(value) {
        EditEntityFormFunctions.setValue(hiddenFieldName, value, {shouldValidate: true});
    }

    const borderStyle = !!errors[hiddenFieldName] ? {border: '1px solid black'} : null;

    return (
        <>
            <input type={'text'} name={hiddenFieldName}
                   readOnly={readOnly}
                   style={{opacity: '0', position: 'absolute'}}
                   {...EditEntityFormFunctions.register(hiddenFieldName, property.validation)}
            />
            <SummaryListSmall entityType={entityTypes[property.target]}
                              initialIdList={initialIdList}
                              receiver={'Input'}
                              key={elKey + hiddenFieldName + '_obj'}
                              elKey={elKey + hiddenFieldName + '_obj'}
                              UICues={{hasFocus: false, hasNull, isMulti, borderStyle, readOnly}}
                              setHiddenField={setHiddenField}
            />
        </>
    );
}
