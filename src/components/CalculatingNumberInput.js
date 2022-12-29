import { useState, Fragment } from 'react';
import { conversions } from './UnitInput';
import { hints, languageSelector } from '../helpers';

const messages = {
    NL: {
        toInput: 'herbereken 𝒊𝒏𝒗𝒐𝒆𝒓 naar gekozen eenheid',//invoer
        toResult: 'herbereken 𝒓𝒆𝒔𝒖𝒍𝒕𝒂𝒂𝒕 naar gekozen eenheid',//resultaat
    },
    EN: {
        toInput: 'recalculate 𝒊𝒏𝒑𝒖𝒕 to chosen unit',//input
        toResult: 'recalculate 𝒓𝒆𝒔𝒖𝒍𝒕 to chosen unit',//result
    }
};

export function CalculatingNumberInput({
                                           setResult, quantityName,
                                           defaultValue, valueInBaseUnits,
                                           elKey, readOnly, style,
                                           // fieldName
                                       }) {
    // const logRoot = rootMkr(CalculatingNumberInput);
    const units = conversions[quantityName];
    const [unitIndex, setUnitIndex] = useState(0);
    const [inputValue, setInputValue] = useState(defaultValue);


    const TXT = messages[languageSelector()];

    function setValue(x) {
        setInputValue(x);
        setResult(units[unitIndex].calc(x));

    }

    function handleInput(event) {
        if (!readOnly) setValue(+event.target.value);
    }

    function clear(event) {
        event.preventDefault();
        setValue('');
    }

    function handleSelectLeft(event) {
        const newIndex = event.target.value;
        setUnitIndex(newIndex);
        setInputValue(units[newIndex].inv(valueInBaseUnits));
    }

    function handleSelectRight(event) {
        const newIndex = event.target.value;
        setUnitIndex(newIndex);
        if (!readOnly) setResult(units[newIndex].calc(+inputValue));
    }

    // const counter = useCounter(logRoot, fieldName, 1000);
    // if (counter.passed) return <Sorry context={logRoot} counter={counter}/>;

    return (
        <>
            <input type="number"
                   value={inputValue}
                   onChange={handleInput}
                   readOnly={readOnly}
                   style={style}
            />
            {!readOnly && (
                <button onClick={clear} style={{
                    border: 'none',
                    opacity: '70%',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    paddingLeft: '1px'
                }}>␡</button>
            )}
            &nbsp;
            <span title={hints(TXT.toInput)}>
                ↢
                <select onChange={handleSelectLeft} value={unitIndex}>
                    {units.map((unit, index) =>
                        <Fragment key={elKey + unit.name + index}>
                            <option label={unit.name}
                                    value={index}
                                    title={hints(unit.label)}
                            />
                        </Fragment>
                    )}
                </select>
            </span>
            <span title={hints(TXT.toResult)}>
                <select onChange={handleSelectRight} value={unitIndex}>
                    {units.map((unit, index) =>
                        <Fragment key={elKey + unit.name + index}>
                            <option label={unit.name}
                                    value={index}
                            />
                        </Fragment>
                    )}
                </select>
                ↣
            </span>
        </>
    );
}