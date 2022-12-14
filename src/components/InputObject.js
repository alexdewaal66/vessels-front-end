import { entityTypes, fieldTypes } from '../helpers/globals/entityTypes';
import { sessionConfig } from '../helpers/globals/sessionConfig';
import { useImmutableSet, useMountEffect } from '../helpers';
import React from 'react';
import { SummaryListSmall } from './summaryList';
import { rootMkr, pathMkr, logv, logCondition } from '../dev/log';
import { ValidationMessage } from './ValidationMessage';
import { crossFieldExpansion } from '../helpers/crossFieldExpansion';
import { useToggleState } from '../helpers/useToggleState';
import { SummaryLine } from './summaryList/SummaryLine';

// import { Value } from '../dev/Value';

// const messages = {NL: {}, EN: {}};

function collapseInverter(x) {
    return sessionConfig.collapseInputObject.value ? !x : x;
}

const hiddenFieldStyle = () =>
    sessionConfig.showHiddenFields.value
        ? {opacity: '50%', cursor: 'default'}
        : {opacity: '0', position: 'absolute', width: 0,};


function blns(x) {
    let output = '';
    for (const xKey in x) {
        output += xKey + (x ? ':𝐓 ; ' : ':𝐅 ; ');
    }
    return output.slice(0, -3);
}

export function InputObject({
                                entityType, fieldName, defaultValue, entityForm, isEligible,
                                readOnly, elKey, parentType, ...rest
                            }) {
    const logRoot = rootMkr(InputObject, entityType.name, fieldName, readOnly);
    const doLog = logCondition(InputObject, entityType.name, fieldName);
    const typeField = entityType.fields[fieldName];
    if (doLog) logv(logRoot, {field: typeField, defaultValue, '!defaultValue': !defaultValue});
    // const {hasNull, isMulti} = typeField;
    const {hasNull} = typeField;
    const isMulti = typeField.type === fieldTypes.arr;
    const initialIdList = Array.isArray(defaultValue)
        ? defaultValue.map(item => item.id)
        : [defaultValue.id];
    const [isCollapsed, toggleCollapsed] = useToggleState(collapseInverter(false));

    const selectedIds = useImmutableSet(initialIdList, 'selectedIds', logRoot, entityType.name);

    // logv(null, {initialId});

    const {register, trigger, setValue, formState: {errors}, getValues} = entityForm;

    useMountEffect(() => {
        trigger(fieldName).then();
    });

    // const TXT = messages[languageSelector()];

    function setHiddenField(value) {
        // const logPath = pathMkr(logRoot, setHiddenField, value);
        setValue(fieldName, value, {shouldValidate: true});
    }

    const borderStyle = !!errors[fieldName] && !readOnly ? {border: '1px solid black'} : null;

    // const counter = useCounter(logRoot, entityType.name, 1000, 50);
    // if (counter.passed) return <Sorry context={logRoot} counter={counter}/>;

    function loggingRegister() {
        const logPath = pathMkr(logRoot, loggingRegister);
        const registration = register(fieldName, crossFieldExpansion(typeField, getValues));
        if (doLog) logv(logPath, {registration});
        return registration;
    }

    return (
        <>
            <input type={'text'} name={fieldName}
                   defaultValue={defaultValue.id}
                   readOnly={readOnly}
                   style={hiddenFieldStyle()}
                   {...loggingRegister()}
                   {...rest}
            />
            <span style={hiddenFieldStyle()}>
                {blns({isCollapsed})} ; length: {initialIdList.length}
            </span>
            {(isCollapsed && initialIdList.length < 2) ? (
                <>
                    <SummaryLine entityType={entityTypes[typeField.target]}
                                 initialIdList={initialIdList}
                                 receiver={'Input'}
                                 key={elKey + fieldName + '_obj'}
                                 elKey={elKey + fieldName + '_obj'}
                                 UICues={{hasFocus: false, hasNull, isMulti, borderStyle, readOnly}}
                                 setHiddenField={setHiddenField}
                                 toggleCollapsed={toggleCollapsed}
                                 parentType={entityType.name}
                    />
                </>
            ) : (
                <>
                    <SummaryListSmall entityType={entityTypes[typeField.target]}
                                      initialIdList={initialIdList}
                                      receiver={'Input'}
                                      key={elKey + fieldName + '_obj'}
                                      elKey={elKey + fieldName + '_obj'}
                                      UICues={{hasFocus: false, hasNull, isMulti, borderStyle, readOnly}}
                                      setHiddenField={setHiddenField}
                                      toggleCollapsed={toggleCollapsed}
                                      parentName={entityType.name}
                                      selectedIds={selectedIds}
                    />

                </>
            )}
            &nbsp;
            {!readOnly && (
                <ValidationMessage form={entityForm} fieldName={fieldName}/>
            )}
        </>
    );
}
