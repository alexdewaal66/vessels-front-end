import { entitiesMetadata, useMountEffect } from '../helpers';
import React, { useRef, useState } from 'react';
import { logv } from '../dev/log';
import { SummaryListSmall } from './summaryList';

export function InputObject({metadata, field, defaultValue, useFormFunctions, elKey}) {
    const logRoot = `${InputObject.name}(${metadata.name})`;
    // logv(logRoot, {field, defaultValue, '!defaultValue': !defaultValue});
    const property = metadata.properties[field];
    const nullFieldRef = useRef(null);
    let hiddenFieldName, nullFieldName;
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];

    // logv(null, {initialIdList});
    nullFieldName = 'null_' + field + '_' + property.target;
    hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';

    const checkNullField = (value) => () => {
        const logPath = `${logRoot} » ${checkNullField.name}`;
        // logv(logPath, {value});
        nullFieldRef.current.value = value;
        nullFieldRef.current.checked = value;
    }

    useMountEffect(checkNullField(!defaultValue));

    return (
        <>
            <label><input type="checkbox"
                          value={!defaultValue}
                          checked={!defaultValue}
                          name={nullFieldName}
                          {...useFormFunctions.register(nullFieldName)}
                          ref={nullFieldRef}
                          key={elKey + nullFieldName + '_obj'}
                          onClick={checkNullField(true)}
            />geen</label>
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
                         inputHelpFields={[hiddenFieldName, nullFieldRef]}
            />
        </>
    );
}
