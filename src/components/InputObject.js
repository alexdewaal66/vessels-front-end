import { entitiesMetadata } from '../helpers';
import React from 'react';
import { SummaryListSmall } from './summaryList';

export function InputObject({metadata, field, defaultValue, useFormFunctions, elKey}) {
    // const logRoot = rootMkr(InputObject, metadata.name);
    // logv(logRoot, {field, defaultValue, '!defaultValue': !defaultValue});
    const property = metadata.properties[field];
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];

    // logv(null, {initialId});

    const hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';

    function setHiddenField(value) {
        useFormFunctions.setValue(hiddenFieldName, value);
    }

    return (
        <>
            <SummaryListSmall metadata={entitiesMetadata[property.target]}
                              initialIdList={initialIdList}
                              receiver={'Input'}
                              key={elKey + hiddenFieldName + '_obj'}
                              elKey={elKey + hiddenFieldName + '_obj'}
                              UICues={{hasFocus: false}}
                              setHiddenField={setHiddenField}
            />
        </>
    );
}
