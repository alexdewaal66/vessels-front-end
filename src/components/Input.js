import React from 'react';

import { subtypes, types } from '../helpers';
import { Stringify } from '../dev/Stringify';
import { InputObject, InputImageFile, ValidationMessage } from './';
// import { Value } from '../dev/Value';
// import { rootMkr, pathMkr, logv } from '../dev/log';

const inputTypes = {
    button: {element: 'input', type: 'button'},
    checkbox: {element: 'input', type: 'checkbox'},
    color: {element: 'input', type: 'color', simple: true},
    date: {element: 'input', type: 'date', simple: true},
    datetimeLocal: {element: 'input', type: 'datetime-local', simple: true},
    email: {element: 'input', type: 'email', simple: true},
    file: {element: 'input', type: 'file', simple: true},
    hidden: {element: 'input', type: 'hidden'},
    image: {element: 'input', type: 'image'},
    month: {element: 'input', type: 'month', simple: true},
    number: {element: 'input', type: 'number'},
    password: {element: 'input', type: 'password', simple: true},
    radio: {element: 'input', type: 'radio'},
    range: {element: 'input', type: 'range'},
    search: {element: 'input', type: 'search'},
    submit: {element: 'input', type: 'submit'},
    tel: {element: 'input', type: 'tel', simple: true},
    text: {element: 'input', type: 'text'},
    time: {element: 'input', type: 'time', simple: true},
    url: {element: 'input', type: 'url', simple: true},
    week: {element: 'input', type: 'week', simple: true},
    select: {element: 'select'},
    textarea: {element: 'textarea'},
}

const aspectRatio = 15;
const referenceSize = 80;

export function Input({
                          entityType, field, defaultValue,
                          entityForm, readOnly, isEligible, ...rest
                      }) {
    // const logRoot = rootMkr(Input, entityType.name);
    const property = entityType.properties[field];
    const elKey = `Input(${entityType.name},${field},${defaultValue})`;

    readOnly = !!(readOnly || entityType.methods === 'R' || property?.readOnly);
    // logv(logRoot, {field, property, readOnly});
    // const [command, setCommand] = useContext(CommandContext);
    let inputType = {};
    let maxLength = property?.validation?.maxLength?.value;
    let inputSize = null;
    let rows = null;
    let cols = null;
    let step = null;
    let fieldValue = defaultValue;

    switch (property?.type) {
        case types.str:
            switch (property?.subtype) {
                case subtypes.email:
                    inputType = inputTypes.email;
                    inputSize = Math.min(referenceSize, maxLength);
                    break;
                default:
                    // console.log(`Input » types.str » default \n\t maxLength=`, maxLength);
                    if (maxLength < 4 * referenceSize) {
                        inputType = inputTypes.text;
                        maxLength = maxLength || referenceSize;
                        inputSize = Math.min(referenceSize, maxLength);
                    } else {
                        inputType = inputTypes.textarea;
                        cols = Math.max(referenceSize, Math.min(2 * referenceSize, Math.ceil(Math.sqrt(maxLength / aspectRatio))));
                        rows = Math.max(3, Math.min(referenceSize / aspectRatio, Math.ceil(maxLength / cols)));
                        const valueRows = defaultValue.length / cols;
                        rows = (rows + valueRows) / 2;
                    }
            }
            break;
        case types.num:
            inputType = inputTypes.number;
            step = 'any';
            break;
        case types.obj:
            return (
                    <InputObject entityType={entityType}
                                field={field}
                                defaultValue={defaultValue}
                                entityForm={entityForm}
                                readOnly={readOnly}
                                isEligible={isEligible}
                                elKey={elKey}
                />
            );
        case types.bool:
            inputType = inputTypes.checkbox;
            break;
        case types.date:
            inputType = inputTypes.date;
            fieldValue = defaultValue.toString().split('T')[0];
            break;
        case types.img:
        case types.file:
            return (
                <InputImageFile entityType={entityType}
                                field={field}
                                defaultValue={defaultValue}
                                entityForm={entityForm}
                                readOnly={readOnly}
                                isEligible={isEligible}
                                elKey={elKey}
                />
            );
        default:
            return (<>
                entityType: <Stringify data={entityType}/>
                <br/>
                field: <Stringify data={field}/>
            </>);
    }

    return (
        <>
            <inputType.element
                type={inputType.type}
                maxLength={maxLength}
                step={step}
                size={inputSize}
                name={field}
                rows={rows}
                cols={cols}
                defaultValue={fieldValue}
                // defaultChecked={defaultValue}
                readOnly={readOnly}
                {...entityForm.register(field, property?.validation)}
                {...rest}
            />
            &nbsp;
            <ValidationMessage form={entityForm} fieldName={field}/>
        </>
    );
}
