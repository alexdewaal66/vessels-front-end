import React from 'react';

import { types } from '../helpers/endpoints';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { SummaryList } from './summaryList';
import { Stringify } from '../dev/Stringify';

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

export function Input({metadata, field, defaultValue, register, readOnly, ...rest}) {
    const property = metadata.properties[field];
    // console.log(`metadata=`, metadata, `\nfield=`, field, `\nproperty=`, property);
    readOnly = readOnly || metadata.methods === 'R' || property.readOnly;
    let inputType = {};
    let maxLength = property?.validation?.maxLength;
    let inputSize = null;
    let rows = null;
    let cols = null;
    let step = null;

    switch (property?.type) {
        case types.str:
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
            break;
        case types.num:
            inputType = inputTypes.number;
            step = 'any';
            break;
        case types.obj:

            return (
                <>
                    {/*defaultValue: <Stringify data={defaultValue} />*/}
                    {/*entitiesMetadata[property.target]: <Stringify data={entitiesMetadata[property.target]} />*/}
                    {/*<ItemSummary item={defaultValue}*/}
                    {/*             metadata={entitiesMetadata[property.target]}*/}
                    {/*/>*/}
                    <SummaryList metadata={entitiesMetadata[property.target]}
                                 initialId={defaultValue.id}
                                 small
                                 receiver={'Input'}
                                 key={metadata.name + 'Input' + defaultValue.id}
                                 hasFocus={false}
                    />
                </>
            );
        default:
            return (<>
                metadata: <Stringify data={metadata}/>
                <br/>
                field: <Stringify data={field}/>
            </>);
    }

    return (
        <inputType.element
            type={inputType.type}
            step={step}
            size={inputSize}
            name={field}
            rows={rows}
            cols={cols}
            defaultValue={defaultValue}
            readOnly={readOnly}
            {...register(field, property?.validation)}
            {...rest}
        />
    );
}


