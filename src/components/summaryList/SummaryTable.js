import React, { useState } from 'react';
import { SummaryHeading, SummaryRow, summaryStyle } from './';
import { cx } from '../../helpers/multipleStyles';

export function SummaryTable({list, metadata, selectedId, selectItem, small, hasFocus}) {
    const smallStyle = (small) ? summaryStyle.small : '';

    const entityName = metadata.name;
    // console.log(now() +  ` entityName=`, entityName);
    const selectedIndex = Math.max(list.findIndex(item => item.id === selectedId), 0);
    const [focusIndex, setFocusIndex] = useState( selectedIndex);
    const [hasTableFocus, setHasTableFocus] = useState(hasFocus);

    const rowFocus = {
        up: function () {
            setFocusIndex(Math.max(0, focusIndex - 1));
        },
        down: function () {
            setFocusIndex(Math.min(list.length - 1, focusIndex + 1));
        },
        tenUp: function () {
            setFocusIndex(Math.max(0, focusIndex - 10));
        },
        tenDown: function () {
            setFocusIndex(Math.min(list.length - 1, focusIndex + 10));
        },
        first: function () {
            setFocusIndex(0);
        },
        last: function focusLast() {
            setFocusIndex(list.length - 1);
        },
        set: setFocusIndex
    };

    function handleFocus(e) {
        if (e.currentTarget === e.target) {
            console.log('focused self');
            // table gained focus, set to selected row
            setHasTableFocus(true);
            setFocusIndex(selectedIndex);
        }
    }

    function handleBlur(e) {
        if (e.currentTarget === e.target) {
            console.log('UNfocused self');
            setHasTableFocus(false);
        }
    }

    return (
        <div className={cx(summaryStyle.tableFixHead, smallStyle)}
             onFocus={handleFocus}
             onBlur={handleBlur}
             tabIndex={0}
        >
            <table className={summaryStyle.table}>
                <thead>
                <SummaryHeading metadata={metadata} elKey={entityName}/>
                </thead>
                <tbody>
                {list.map((listItem, index) => (
                    <SummaryRow listItem={listItem}
                                index={index}
                                metadata={metadata}
                                selectItem={selectItem}
                                key={entityName + listItem.id}
                                elKey={entityName + listItem.id}
                                rowFocus={rowFocus}
                                hasFocus={index === focusIndex && hasTableFocus}
                                isSelected={index===selectedIndex}
                                hasVisualPriority={hasTableFocus ? (index === focusIndex) : (index === selectedIndex)}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}

/*

        focusIndex | selectedIndex | hasTableFocus | priority
        -----------------------------------------------------
        index      |      *        |      true     |   index
        *          |    index      |     false     |   index

 */




