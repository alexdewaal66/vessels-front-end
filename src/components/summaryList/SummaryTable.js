import React, { useState } from 'react';
import { SummaryHeading, SummaryRow, summaryStyle } from './';
import { cx } from '../../helpers';
import { logv, errv } from '../../dev/log';
import { useFilters } from './UseFilters';

export function SummaryTable({
                                 list, metadata, selectedIds, chooseItem, small,
                                 hasFocus, elKey, setSorting, setFiltering
                             }) {
    const sizeStyle = (small) ? summaryStyle.small : summaryStyle.tall;
    elKey += '/STable';

    const entityName = metadata.name;
    const idName = metadata.id[0];
    const logRoot = `SummaryTable(${entityName})`;

    logv(logRoot, {list});

    const {matchItem, mergeConstraints} = useFilters(metadata);
    const displayList = list.filter(matchItem);

    // find 'first' selected item in list
    const selectedIndex = selectedIds ? Math.max(displayList.findIndex(item => selectedIds.has(item[idName])), 0) : null;
    const [focusIndex, setFocusIndexState] = useState(selectedIndex);
    const [hasTableFocus, setTableFocus] = useState(hasFocus);

    function setFocusIndex(i) {
        setFocusIndexState(i);
        setTableFocus(true);
        // console.log(now(), `elKey=`, elKey, `\n new focusIndex should be: `, i);
    }

    const rowFocus = {
        up: function () {
            setFocusIndex(fi => Math.max(0, fi - 1));
        },
        down: function () {
            setFocusIndex(fi => Math.min(displayList.length - 1, fi + 1));
        },
        tenUp: function () {
            setFocusIndex(fi => Math.max(0, fi - 10));
        },
        tenDown: function () {
            setFocusIndex(fi => Math.min(displayList.length - 1, fi + 10));
        },
        first: function () {
            setFocusIndex(0);
        },
        last: function focusLast() {
            setFocusIndex(displayList.length - 1);
        },
        set: setFocusIndex
    };

    function handleFocus(e) {
        if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) {
            // console.log(now(),'handleFocus: focused self', `\nelKey=`, elKey);
            // table gained focus, set to selected row
            // setTableFocus(true);
            setFocusIndex(selectedIndex);
        }
    }

    function handleBlur(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            // console.log(now(),'handleBlur: focus left self',
            //     '\ne.currentTarget=', e.currentTarget,
            //     '\ne.relatedTarget=', e.relatedTarget,
            //     `\nelKey=`, elKey, '\nevent=', e);
            setTableFocus(false);
        }
    }

    function UICues(index) {
        return {
            hasFocus: (index === focusIndex && hasTableFocus),
            // isSelected: (index === selectedIndex),
            isSelected: selectedIds?.has(displayList[index][idName]),
            hasVisualPriority: hasTableFocus ? (index === focusIndex) : (index === selectedIndex),
            small
        }
    }

    return (
        <div>
            {/*<div>ST: focusIndex={focusIndex} ; selectedIndex={selectedIndex}</div>*/}
            <div className={cx(summaryStyle.tableFixHead, sizeStyle)}
                 onFocus={handleFocus}
                 onBlur={handleBlur}
                 tabIndex={0}
            >
                <table className={summaryStyle.table}>
                    <thead>
                    <SummaryHeading metadata={metadata}
                                    elKey={entityName}
                                    setSorting={setSorting}
                                    setFiltering={setFiltering}
                                    mergeConstraints={mergeConstraints}
                    />
                    </thead>
                    <tbody>
                    {displayList.map((listItem, index) => (
                        <SummaryRow listItem={listItem}
                                    index={index}
                                    metadata={metadata}
                                    chooseItem={chooseItem}
                                    key={elKey + index}
                                    elKey={elKey + index}
                                    rowFocus={rowFocus}
                                    UICues={UICues(index)}

                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
