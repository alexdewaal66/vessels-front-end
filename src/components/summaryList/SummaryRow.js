import React, { useContext, useEffect, useRef, useState } from 'react';
import { summaryStyle } from './index';

const keys = {tab: 9, enter: 13, escape:27, space: 32, arrowUp: 38, arrowDown: 40, home: 36, end: 35, pageUp: 33, pageDown: 34};

export function SummaryRow({listItem, index, metadata, selectItem, rowFocus, UICues, elKey}) {
    const { hasFocus, isSelected, hasVisualPriority } = UICues;
    const row = useRef(null);
    const selectedStyle = isSelected ? summaryStyle.selected : null;
    elKey += `/SRow`;


    useEffect(function scrollAndFocusIfNecessary() {
        if (hasVisualPriority)
            row.current.scrollIntoView({block: "center"});
        if (hasFocus) {
            // console.log(`index=`, index);
            setFocus();
        }
    });

    function setFocus() {
        row.current?.focus();
        rowFocus.set(index);
    }

    function choose() {
        // rowFocus.set(index);
        selectItem(listItem);
        setFocus();
    }

    function handleOnKeyDown(e) {
        // console.log(`e.keyCode=`, e.keyCode);
        console.log(`e.key=`, e.key);
        // console.log(`elKey=`, elKey);
        switch (e.keyCode) {
            case keys.enter:
            case keys.space:
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
            onKeyDown={handleOnKeyDown}
            ref={row}
            tabIndex={0}
            key={elKey}
            className={selectedStyle}
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

