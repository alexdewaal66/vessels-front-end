import { useEffect, useState, Fragment } from 'react';
import { conversions } from './UnitInput';
import { useCounter } from '../dev/useCounter';
import { Sorry } from '../dev/Sorry';
import { rootMkr } from '../dev/log';
import { hints } from '../helpers';

export function CalculatingNumberInput({
                                           setResult, quantityName,
                                           defaultValue, valueInBaseUnits,
                                           elKey, readOnly, fieldName
                                       }) {
    const logRoot = rootMkr(CalculatingNumberInput);
    const units = conversions[quantityName];
    const [unitIndex, setUnitIndex] = useState(0);
    const [inputValue, setInputValue] = useState(defaultValue);
    const [isInputChanged, setInputChanged] = useState(false);


    // useEffect(() => {
    //         if (!readOnly) setResult(units[unitIndex].calc(+inputValue));
    //     },
    //     [inputValue, unitIndex] //, setResult, units]
    // );

    function handleInput(e) {
        if (!readOnly) {
            setInputValue(e.target.value);
            setInputChanged(true);
        }
    }

    // function handleSelect(e) {
    //     const newIndex = e.target.value;
    //     setUnitIndex(newIndex);
    //     if (!isInputChanged) {
    //         setInputValue(units[newIndex].inv(valueInBaseUnits));
    //     }
    //     setInputChanged(false);
    // }

    function handleSelectLeft(e) {
        const newIndex = e.target.value;
        setUnitIndex(newIndex);
        setInputValue(units[newIndex].inv(valueInBaseUnits));
    }

    function handleSelectRight(e) {
        const newIndex = e.target.value;
        setUnitIndex(newIndex);
        if (!readOnly) setResult(units[newIndex].calc(+inputValue));
    }

    const counter = useCounter(logRoot, fieldName, 100);
    if (counter.passed) return <Sorry context={logRoot} count={counter.value}/>;

    return (
        <>
            {/*<br/>*/}
            {/*calc={conversions[unitIndex].calc.toString()}*/}
            {/*<br/>*/}
            <input type="number"
                   value={inputValue}
                   onChange={handleInput}
                   readOnly={readOnly}
            />
            &nbsp;
            {/*<select onChange={handleSelect} defaultValue={0}>*/}
            {/*    {units.map((unit, index) =>*/}
            {/*        <Fragment key={elKey + unit.name + index}>*/}
            {/*            <option label={unit.name}*/}
            {/*                    value={index}*/}
            {/*            />*/}
            {/*        </Fragment>*/}
            {/*    )}*/}
            {/*</select>*/}
            <span title={hints('herbereken invoer naar gekozen eenheid')}>
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
            <span title={hints('herbereken resultaat naar gekozen eenheid')}>
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