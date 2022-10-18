import { CalculatingNumberInput } from './CalculatingNumberInput';
import { useEffect, useState } from 'react';
import { useCounter } from '../dev/useCounter';
import { rootMkr } from '../dev/log';
import { Sorry } from '../dev/Sorry';
import { ValidationMessage } from './ValidationMessage';
import { crossFieldExpansion } from '../helpers/crossFieldExpansion';

export const conversions = {
    length: [
        {name: 'm', label: 'meter', calc: x => x, inv: x => x},
        {name: 'ft', label: 'foot', calc: x => 0.3048 * x, inv: x => x / 0.3048},
        {name: 'dm', label: 'decimeter', calc: x => x / 10, inv: x => 10 * x},
        {name: 'inch', calc: x => 0.0254 * x, inv: x => x / 0.0254},
        {name: 'cm', label: 'centimeter', calc: x => x / 100, inv: x => 100 * x},
    ],
    area: [
        {name: 'm²', calc: x => x, inv: x => x},
        {name: 'ft²', calc: x => 0.3048 ** 2 * x, inv: x => x / 0.3048 ** 2},
        {name: 'dm²', calc: x => x / 10 ** 2, inv: x => 10 ** 2 * x},
        {name: 'inch²', calc: x => 0.0254 ** 2 * x, inv: x => x / 0.0254 ** 2},
        {name: 'cm²', calc: x => x / 100 ** 2, inv: x => 100 ** 2 * x},
    ],
    volume: [
        {name: 'm³', calc: x => x, inv: x => x},
        {name: 'ft³', calc: x => 0.3048 ** 3 * x, inv: x => x / 0.3048 ** 3},
        {name: 'dm³', label: ['kubieke decimeter', 'liter'], calc: x => x / 10 ** 3, inv: x => 10 ** 3 * x},
        {name: 'inch³', calc: x => 0.0254 ** 3 * x, inv: x => x / 0.0254 ** 3},
        {name: 'cm³', calc: x => x / 100 ** 3, inv: x => 100 ** 3 * x},
    ],
    temperature: [
        {name: 'K', label: 'Kelvin', calc: x => x, inv: x => x},
        {name: '°C', label: 'Celsius', calc: x => x + 272.15, inv: x => x - 272.15},
        {name: '°F', label: 'Fahrenheit', calc: x => (x + 459.67) * 5 / 9, inv: x => x * 9 / 5 - 459.67},
    ],
    displacement: [
        {name: 'tonne', calc: x => x, inv: x => x},
        {name: 'short ton', calc: x => 0.907 * x, inv: x => x / 0.907},
        {name: 'long ton', calc: x => 1.016_047 * x, inv: x => x / 1.016_047},
    ],
};

export const quantityNames = {
    length: 'length', area: 'area', volume: 'volume',
    temperature: 'temperature',
    displacement: 'displacement',
};

export function UnitInput({
                              fieldName, typeField, defaultValue,
                              entityForm, readOnly, elKey
                          }) {
    const logRoot = rootMkr(UnitInput, fieldName, readOnly)
    const [valueInBaseUnits, setValueInBaseUnits] = useState(defaultValue);
    const baseUnitName = conversions[typeField.quantity][0].name;

    const {register, trigger, setValue, formState: {errors}, getValues} = entityForm;
    useEffect(() => {
        trigger(fieldName).then();
    }, []);

    const borderStyle = !!errors[fieldName] && !readOnly ? {border: '1px solid black'} : null;

    function setResult(result) {
        setValueInBaseUnits(result);
        setValue(fieldName, result, {shouldValidate: true});
        // setValueInBaseUnits(+entityForm.getValues(fieldName));
        // trigger(fieldName).then();
    }

    function twoDecimals(x) {
        return Number(x).toFixed(2);
    }

    const counter = useCounter(logRoot, fieldName, 1000);
    if (counter.passed) return <Sorry context={logRoot} counter={counter}/>;


    return (
        <>
            <input
                type={'hidden'}
                // type={'number'}
                // style={{opacity: '50%', border: '1px solid green'}}
                name={fieldName}
                defaultValue={defaultValue}
                readOnly={readOnly}
                {...register(fieldName, crossFieldExpansion(typeField, getValues))}
                key={elKey + fieldName + 'hidden'}
            />
            <CalculatingNumberInput quantityName={typeField.quantity}
                                    defaultValue={defaultValue}
                                    valueInBaseUnits={valueInBaseUnits}
                                    key={elKey + fieldName}
                                    elKey={elKey + fieldName}
                                    setResult={setResult}
                                    readOnly={readOnly}
                                    fieldName={fieldName}
                                    style={borderStyle}
            />
            &nbsp;
            <span style={{opacity: '50%'}}>({twoDecimals(valueInBaseUnits) + ' ' + baseUnitName})</span>
            <ValidationMessage fieldName={fieldName} form={entityForm}/>
        </>
    );
}