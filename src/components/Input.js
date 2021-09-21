import React from 'react';

import { subtypes, types } from '../helpers/endpoints';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { SummaryList } from './summaryList';
import { Stringify } from '../dev/Stringify';
// import { CommandContext, useCommand } from '../contexts/CommandContext';

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

export function Input({metadata, field, defaultValue, useFormFunctions, readOnly, ...rest}) {
    const property = metadata.properties[field];
    const elKey = `Input(${metadata.name},${field},${defaultValue})`;

    // console.log(`metadata=`, metadata, `\nfield=`, field, `\nproperty=`, property);
    readOnly = readOnly || metadata.methods === 'R' || property?.readOnly;
    // const [command, setCommand] = useContext(CommandContext);
    // const [fieldNameOfListedEntity, setFieldNameOfListedEntity] = useState(null);
    let inputType = {};
    let maxLength = property?.validation?.maxLength;
    let inputSize = null;
    let rows = null;
    let cols = null;
    let step = null;
    let hiddenFieldName;

    switch (property?.type) {
        case types.str:
            switch (property?.subtype) {
                case subtypes.email:
                    inputType = inputTypes.email;
                    inputSize = Math.min(referenceSize, maxLength);
                    break;
                default:
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
            hiddenFieldName = 'hidden_' + field + '_' + property.target +'_id';
            return (
                <>
                    {/*<div>IN: {hiddenFieldName} = {defaultValue.id}</div>*/}
                    <input type="hidden"
                           readOnly={true}
                           name={hiddenFieldName}
                           defaultValue={defaultValue.id}
                           {...useFormFunctions.register(hiddenFieldName)}
                           key={elKey + hiddenFieldName + '_objId'}
                    />
                    <SummaryList metadata={entitiesMetadata[property.target]}
                                 initialId={defaultValue.id}
                                 small
                                 receiver={'Input'}
                                 key={elKey + hiddenFieldName + '_obj'}
                                 elKey={elKey + hiddenFieldName + '_obj'}
                                 UICues={{small:true, hasFocus: false}}
                                 useFormFunctions={useFormFunctions}
                                 hiddenFieldName={hiddenFieldName}
                    />
                </>
            );
        case types.arr:
            hiddenFieldName = 'hidden_' + field + '_' + property.target +'_id_list';
            return (
                <>
                    <div>IN: {hiddenFieldName} = {defaultValue.id}</div>
                    <input type="hidden"
                           readOnly={true}
                           name={hiddenFieldName}
                           defaultValue={defaultValue.id}
                           {...useFormFunctions.register(hiddenFieldName)}
                           key={elKey + hiddenFieldName + '_arrIdx'}
                    />
                    <SummaryList metadata={entitiesMetadata[property.target]}
                                 initialId={defaultValue.id}
                                 small
                                 receiver={'Input'}
                                 key={elKey + hiddenFieldName + '_arr'}
                                 elKey={elKey}
                                 UICues={{small:true, hasFocus: false}}
                                 useFormFunctions={useFormFunctions}
                                 hiddenFieldName={hiddenFieldName}
                    />
                </>
            );
        case types.bool:
            inputType = inputTypes.checkbox;
            break;
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
            defaultChecked={defaultValue}
            readOnly={readOnly}
            {...useFormFunctions.register(field, property?.validation)}
            {...rest}
        />
    );
}


