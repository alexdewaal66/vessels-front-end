import { SummaryList } from './summaryList';
import { entitiesMetadata } from '../helpers';
import React, { useRef } from 'react';
import { logv } from '../dev/log';

export function InputObject({metadata, field, defaultValue, useFormFunctions, elKey}) {
    const logRoot = `${InputObject.name}(${metadata.name})`;
    logv(logRoot, {field, defaultValue});
    const property = metadata.properties[field];
    const nullFieldRef = useRef(null);
    let hiddenFieldName, nullFieldName;
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];

    logv(null, {initialIdList});
    nullFieldName = 'null_' + field + '_' + property.target;
    hiddenFieldName = 'hidden_' + field + '_' + property.target + '_id';

    function nullHandler() {
        console.log(`----------->>> nullFieldRef.current.checked=`, nullFieldRef.current.checked);
    }

    return (
        <>
            {/*<div>IN: {hiddenFieldName} = <ShowObject data={defaultValue}/></div>*/}
            <label><input type="checkbox"
                          defaultChecked={!defaultValue}
                          name={nullFieldName}
                          {...useFormFunctions.register(nullFieldName)}
                          ref={nullFieldRef}
                          key={elKey + nullFieldName + '_obj'}
                          onClick={nullHandler}
            />geen</label>
            <input type="hidden"
                   readOnly={true}
                   name={hiddenFieldName}
                   id={field}
                   defaultValue={defaultValue.id}
                   {...useFormFunctions.register(hiddenFieldName)}
                   key={elKey + hiddenFieldName + '_objId'}
            />
            <SummaryList metadata={entitiesMetadata[property.target]}
                         initialIdList={initialIdList}
                         receiver={'Input'}
                         key={elKey + hiddenFieldName + '_obj'}
                         elKey={elKey + hiddenFieldName + '_obj'}
                         UICues={{small: true, hasFocus: false}}
                         useFormFunctions={useFormFunctions}
                         inputHelpFields={[hiddenFieldName, nullFieldRef]}
            />
        </>
    );
}
