import React, { useState, useRef } from 'react';
import { SummaryHeading, SummaryRow, summaryStyle } from './';
import { cx, hints} from '../../helpers';
import { useFilters } from './useFilters';
import { useFieldStatuses } from './useFieldStatuses';

// const messages = {NL: {}, EN: {}};

const multiSelectHint = {
    NL: 'Meervoudige selectie mogelijk mbv Ctrl-toets',
    EN: 'Multiple selection possible using Ctrl key',
};

export function SummaryTable({
                                 list, entityType, selectedIds, chooseItem, small,
                                 UICues, elKey, sorting, setFiltering, toggleCollapsed, parentName }) {
    const sizeStyle = (small) ? summaryStyle.small : summaryStyle.tall;
    elKey += '/STable';

    const entityName = entityType.name;
    const {hasFocus, borderStyle, readOnly, isMulti} = UICues;
    const idName = entityType.id[0];
    // const logRoot = rootMkr(SummaryTable, entityName);
    // logv(logRoot, {list});

    const tableBodyRef = useRef();

    const {matchItem, mergeConstraints} = useFilters(entityType);
    const displayList = list.filter(matchItem);

    // find 'first' selected item in list
    const selectedIndex = selectedIds ? Math.max(displayList.findIndex(item => selectedIds.has(item[idName])), 0) : null;
    const [focusIndex, setFocusIndexState] = useState(selectedIndex);
    const [hasTableFocus, setTableFocus] = useState(hasFocus);

    // const TXT = messages[languageSelector()];

    function setFocusIndex(i) {
        if (!readOnly) {
            setFocusIndexState(i);
            setTableFocus(true);
            // console.log(now(), `elKey=`, elKey, `\n new focusIndex should be: `, i);
        }
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

    function handleFocus(event) {
        // const logPath = pathMkr(logRoot, handleFocus);
        if (event.currentTarget === event.target || !event.currentTarget.contains(event.relatedTarget)) {
            // logv(logPath, {elKey});
            // table gained focus, set to selected row
            // setTableFocus(true);
            setFocusIndex(selectedIndex);
        }
    }

    // useEffect(() => handleFocus({}), toggleCollapsed);

    function handleBlur(event) {
        // const logPath = pathMkr(logRoot, handleBlur);
        if (!event.currentTarget.contains(event.relatedTarget)) {
            // logv(logPath, {
            //     currentTarget: event.currentTarget,
            //     relatedTarget: event.relatedTarget,
            //     elKey, event});
            setTableFocus(false);
        }
    }

    function UIRowCues(index) {
        return {
            ...UICues,
            hasFocus: (index === focusIndex && hasTableFocus),
            // isSelected: (index === selectedIndex),
            isSelected: selectedIds?.has(displayList[index]?.[idName]),
            hasVisualPriority: hasTableFocus ? (index === focusIndex) : (index === selectedIndex),
            small
        }
    }

    const fieldStatuses = useFieldStatuses(entityName, parentName);

    return (
        <div>
            {/*<div>ST: focusIndex={focusIndex} ; selectedIndex={selectedIndex}</div>*/}
            <div className={cx(summaryStyle.tableFixHead, sizeStyle)}
                 onFocus={handleFocus}
                 onBlur={handleBlur}
                 tabIndex={0}
                 style={borderStyle}
            >
                {/*{[...selectedIds.all].toString()};{lastSavedItemId}*/}
                <table className={summaryStyle.table}>
                    <thead>
                    <SummaryHeading entityType={entityType}
                                    elKey={entityName}
                                    sorting={sorting}
                                    setFiltering={setFiltering}
                                    mergeConstraints={mergeConstraints}
                                    small={small}
                                    toggleCollapsed={toggleCollapsed}
                                    fieldStatuses={fieldStatuses}
                    />
                    </thead>
                    <tbody ref={tableBodyRef} title={isMulti ? hints(multiSelectHint): null}>
                    {displayList.map((listItem, index) => (
                        <SummaryRow item={listItem}
                                    index={index}
                                    entityType={entityType}
                                    chooseItem={chooseItem}
                                    key={elKey + index}
                                    elKey={elKey + index}
                                    rowFocus={rowFocus}
                                    UICues={UIRowCues(index)}
                                    tableBodyRef={tableBodyRef}
                                    fieldStatuses={fieldStatuses}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
