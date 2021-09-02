import React, { useState } from 'react';
import { SummaryHeading, SummaryRow, summaryStyle } from './';
import { cx } from '../../helpers/multipleStyles';
import { now } from '../../helpers/utils';

export function SummaryTable({list, metadata, selectedId, selectItem, small, hasFocus, elKey}) {
    const smallStyle = (small) ? summaryStyle.small : '';
    elKey += '/STable';

    const entityName = metadata.name;
    // console.log(now() +  ` entityName=`, entityName);
    const selectedIndex = Math.max(list.findIndex(item => item.id === selectedId), 0);
    const [focusIndex, setFocusIndexState] = useState(selectedIndex);
    const [hasTableFocus, setTableFocus] = useState(hasFocus);

    function setFocusIndex(i) {
        setFocusIndexState(i);
        setTableFocus(true);
        // console.log(now(), `elKey=`, elKey, `\nnew focusIndex should be: `, i);
    }

    const rowFocus = {
        up: function () {
            setFocusIndex(fi => Math.max(0, fi - 1));
        },
        down: function () {
            setFocusIndex(fi => Math.min(list.length - 1, fi + 1));
        },
        tenUp: function () {
            setFocusIndex(fi => Math.max(0, fi - 10));
        },
        tenDown: function () {
            setFocusIndex(fi => Math.min(list.length - 1, fi + 10));
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
            isSelected: (index === selectedIndex),
            hasVisualPriority: hasTableFocus ? (index === focusIndex) : (index === selectedIndex)
        }
    }

    return (
        <div>
            {/*<div>ST: focusIndex={focusIndex} ; selectedIndex={selectedIndex}</div>*/}
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


