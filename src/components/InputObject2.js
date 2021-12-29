import { entitiesMetadata, useMountEffect } from '../helpers';
import React, { useRef, useState } from 'react';
import { logv } from '../dev/log';
import { SummaryListSmall2 } from './summaryList';

export function InputObject2({metadata, field, defaultValue, useFormFunctions, elKey}) {
    const logRoot = `${InputObject2.name}(${metadata.name})`;
    // logv(logRoot, {field, defaultValue, '!defaultValue': !defaultValue});
    const property = metadata.properties[field];
    let hiddenFieldName, nullFieldName;
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];
    const [nullFieldValue, setNullFieldValue] = useState(!defaultValue);

    // logv(null, {initialIdList});
    nullFieldName = 'null_' + field + '_' + property.target;
    hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';

    function checkNullField(value) {
        const logPath = `${logRoot} » ${checkNullField.name}`;
        // logv(logPath, {value});
        setNullFieldValue(value);
    }

    // useMountEffect(checkNullField(!defaultValue));

    return (
        <>
            {/*nullFieldValue:{nullFieldValue.toString()}<br/>*/}
            <input type="hidden"
                          defaultValue={nullFieldValue}
                          defaultChecked={nullFieldValue}
                          name={nullFieldName}
                          key={elKey + nullFieldName + '_obj'}
                          onClick={() => checkNullField(true)}
            />
            <input type="hidden"
                   readOnly={true}
                   name={hiddenFieldName}
                   id={field}
                   defaultValue={defaultValue.id}
                   {...useFormFunctions.register(hiddenFieldName)}
                   key={elKey + hiddenFieldName + '_objId'}
            />
            <SummaryListSmall2 metadata={entitiesMetadata[property.target]}
                              initialIdList={initialIdList}
                              receiver={'Input'}
                              key={elKey + hiddenFieldName + '_obj'}
                              elKey={elKey + hiddenFieldName + '_obj'}
                              UICues={{hasFocus: false}}
                              useFormFunctions={useFormFunctions}
                              inputHelpFields={[hiddenFieldName, checkNullField]}
            />
        </>
    );
}
