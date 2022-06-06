import { useEffect, useState } from 'react';

export function CalculatingNumberInput({setResult, units, defaultValue, elKey}) {
    const [unitIndex, setUnitIndex] = useState(0);
    const [inputValue, setInputValue] = useState(defaultValue);

    useEffect(() =>
            setResult(units[unitIndex].calc(+inputValue)),
            [inputValue, unitIndex]
    );

        function handleInput(e) {
            setInputValue(e.target.value);
        }

        function handleSelect(e) {
            setUnitIndex(e.target.value);
            // setIsUnitChanged(true);
        }


        return (
            <>
                {/*<br/>*/}
                {/*calc={units[unitIndex].calc.toString()}*/}
                {/*<br/>*/}
                <input type="number"
                       value={inputValue}
                       onChange={handleInput}
                />
                &nbsp;
                <select onChange={handleSelect}>
                    {units.map((unit, index) =>
                        <>
                            <option label={unit.name}
                                    value={index}
                                    key={elKey + unit.name}
                                    selected={index === 0}
                            />
                        </>
                    )}
                </select>
            </>
        );
    }