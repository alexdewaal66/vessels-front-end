import React from 'react';

import { entities, types } from '../helpers/endpoints';

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
    textarea: {element: 'textarea'}
}

export function Input({entity, field, defaultValue, register, ...rest}) {
    const property = entities[entity].properties[field];
    let maxLength = property?.validation?.maxLength;
    let inputSize = 0;
    let inputType = {};
    let rows = 2;
    let cols = 10;

    switch (property.type) {
        case types.str:
            if (maxLength < 200) {
                inputType = inputTypes.text;
                maxLength = maxLength || 50;
                inputSize = Math.min(50, maxLength);
            } else {
                inputType = inputTypes.textarea;
                const aspectRatio = 5;
                cols = Math.max(50, Math.min(100, Math.ceil(Math.sqrt(maxLength / aspectRatio))));
                rows = Math.min(50 / aspectRatio, Math.ceil(maxLength / cols));
            }
            break;
        case types.num:
            inputType = inputTypes.number;
            break;
    };

    return (
        <>
            {inputType === inputTypes.text && (
                <input
                    type={inputTypes.text.type}
                    size={inputSize}
                    name={field}
                    defaultValue={defaultValue}
                    {...register(field, property?.validation)}
                    {...rest}
                />
            )}
            {inputType === inputTypes.textarea && (
                <textarea
                    rows={rows}
                    cols={cols}
                    name={field}
                    defaultValue={defaultValue}
                    {...register(field, property?.validation)}
                    {...rest}
                />
            )}
            {inputType.simple && (
                <>
                    <input
                        type={inputType.type}
                        name={field}
                        defaultValue={defaultValue}
                        {...register(field, property?.validation)}
                        {...rest}
                    />
                </>
            )}
            {inputType === inputTypes.number && (
                <>
                    <input
                        type={inputType.type}
                        step="any"
                        name={field}
                        defaultValue={defaultValue}
                        {...register(field, property?.validation)}
                        {...rest}
                    />
                </>
            )}
        </>
    );
}


