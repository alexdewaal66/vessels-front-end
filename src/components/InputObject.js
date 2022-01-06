import { entitiesMetadata } from '../helpers';
import React from 'react';
import { logv } from '../dev/log';
import { SummaryListSmall } from './summaryList';

export function InputObject({metadata, field, defaultValue, useFormFunctions, elKey}) {
    const logRoot = `${InputObject.name}(${metadata.name})`;
    // logv(logRoot, {field, defaultValue, '!defaultValue': !defaultValue});
    const property = metadata.properties[field];
    let hiddenFieldName;
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];

    // logv(null, {initialIdList});

    hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';

    return (
        <>
            <input type="hidden"
                   readOnly={true}
                   name={hiddenFieldName}
                   id={field}
                   defaultValue={defaultValue.id}
                   {...useFormFunctions.register(hiddenFieldName)}
                   key={elKey + hiddenFieldName + '_objId'}
            />
            <SummaryListSmall metadata={entitiesMetadata[property.target]}
                              initialIdList={initialIdList}
                              receiver={'Input'}
                              key={elKey + hiddenFieldName + '_obj'}
                              elKey={elKey + hiddenFieldName + '_obj'}
                              UICues={{hasFocus: false}}
                              useFormFunctions={useFormFunctions}
                              inputHelpFields={[hiddenFieldName]}
            />
        </>
    );
}
