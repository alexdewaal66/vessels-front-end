import React, { useEffect, useRef } from 'react';

const keys = {enter: 13, escape:27, arrowUp: 38, arrowDown: 40, home: 36, end: 35, pageUp: 33, pageDown: 34};

export function SummaryRow({listItem, index, metadata, selectItem, elKey, rowFocus, hasFocus}) {
    const row = useRef(null);

    useEffect(() => {
        if (hasFocus) setFocus();
    });

    function setFocus() {
        row.current?.focus();
    }

    function choose() {
        rowFocus.set(index);
        selectItem(listItem);
        setFocus();
    }

    function chooseByKey(e) {
        switch (e.keyCode) {
            case keys.enter:
                choose();
                return;
            case keys.escape:
                row.current?.blur();
                return;
            case keys.arrowUp:
                rowFocus.up();
                break;
            case keys.arrowDown:
                rowFocus.down();
                break;
            case keys.pageUp:
                rowFocus.tenUp();
                break;
            case keys.pageDown:
                rowFocus.tenDown();
                break;
            case keys.home:
                rowFocus.first();
                break;
            case keys.end:
                rowFocus.last();
                break;
            default:
                return;
        }
        row.current.scrollIntoView({block: "center"});
        e.preventDefault();// suppress default scrolling
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

