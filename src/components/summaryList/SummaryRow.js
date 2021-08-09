import React, { useRef } from 'react';

const keys = {enter: 13, arrowUp: 38, arrowDown: 40};

export function SummaryRow({listItem, index, metadata, setItem, elKey, rowFocus, hasFocus}) {
    const row = useRef(null);
    if (hasFocus) setFocus();

    function setFocus() {
        row.current?.focus();
    }

    function choose() {
        rowFocus.set(index);
        setItem(listItem);
        setFocus();
    }

    function chooseByKey(e) {
        switch (e.keyCode) {
            case keys.enter:
                choose();
                break;
            case keys.arrowUp:
                // console.log(`↑: index=`, index);
                rowFocus.up();
                row.current.scrollIntoView({block: "nearest"});
                e.preventDefault();
                return false; // suppress default scrolling
            case keys.arrowDown:
                // console.log(`↓: index=`, index);
                rowFocus.down();
                e.preventDefault();
                return false; // suppress default scrolling
            default:
                break;
        }
    }

    return (
        <tr onClick={choose}
            onKeyDown={chooseByKey}
            ref={row} tabIndex={index}
            key={elKey}
        >
            {metadata.summary.map(propertyName =>
                <td key={elKey + propertyName}
                >
                    {listItem[propertyName]}
                </td>
            )}
        </tr>
    );
}

