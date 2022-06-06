import { CalculatingNumberInput } from './CalculatingNumberInput';

const units = {
    length: [
        {name: 'm', calc: x => x},
        {name: 'ft', calc: x => 0.3048 * x},
        {name: 'cm', calc: x => 0.01 * x},
        {name: 'inch', calc: x => 0.0254 * x},
    ],
    temperature: [
        {name: 'K', calc: x => x},
        {name: '°C', calc: x => x + 272.15},
        {name: '°F', calc: x => (x + 459.67) * 5 / 9},
    ],
    displacement: [
        {name: 'tonne', calc: x => x},
        {name: 'short ton', calc: x => 0.907 * x},
        {name: 'long ton', calc: x => 1.016_047 * x},
    ],
};

export const quantities = {
    length: 'length',
    temperature: 'temperature',
    displacement: 'displacement',
};

export function UnitInput({
                              fieldName, typeField, defaultValue,
                              entityForm, readOnly, elKey
                          }) {

    function setResult(result) {
        entityForm.setValue(fieldName, result, {shouldValidate: true});
    }

    const valueInBaseUnits = (+entityForm.getValues(fieldName)).toFixed(2);

    return (
        <>
            {/*{fieldName}=*/}
            <input type={'text'}
                   name={fieldName}
                   defaultValue={defaultValue}
                   readOnly={readOnly}
                   {...entityForm.register(fieldName, typeField?.validation)}
                   key={elKey + fieldName}
                   style={{opacity: '0', position: 'absolute'}}
                   // style={{opacity: '50%'}}
            />
            <CalculatingNumberInput units={units[typeField.quantity]}
                                    defaultValue={defaultValue}
                                    elKey={elKey + fieldName}
                                    setResult={setResult}
            />
            &nbsp;
            <span style={{opacity: '50%'}}>({valueInBaseUnits})</span>
        </>
    );
}