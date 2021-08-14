import React, { useState } from 'react';
import { SummaryHeading, SummaryRow, summaryStyle } from './';
import { now } from '../../helpers/utils';
import { cx } from '../../helpers/multipleStyles';

export function SummaryTable({list, metadata, setItem, small}) {
    const smallStyle = (small) ? summaryStyle.small : '';

    const entityName = metadata.name;
    // console.log(now() +  ` entityName=`, entityName);
    const [focusIndex, setFocusIndex] = useState(0);

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

    return (
        <div className={summaryStyle.tableFixHead}>
            <table className={cx(summaryStyle.table, smallStyle)}>
                <thead>
                <SummaryHeading metadata={metadata} elKey={entityName}/>
                </thead>
                <tbody>
                {list.map((listItem, index) => (
                    <SummaryRow listItem={listItem}
                                index={index}
                                metadata={metadata}
                                selectItem={setItem}
                                elKey={entityName + listItem.id}
                                rowFocus={rowFocus}
                                hasFocus={index === focusIndex}
                    />
                ))}
                {/*<HiddenRow list={list} summary={metadata.summary} />*/}
                </tbody>
            </table>
        </div>
    );
}



