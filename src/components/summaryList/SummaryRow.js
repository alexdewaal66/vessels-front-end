import React, { useContext, useEffect, useRef } from 'react';
import { optionalIdValue, summaryStyle } from './index';
import { errv } from '../../dev/log';
import { pathMkr } from '../../dev/log';
import { rootMkr } from '../../dev/log';
import { cx, endpoints, entityTypes, getFieldFromPath, hints, fieldTypes } from '../../helpers';
import { ChoiceContext } from '../../contexts';
import { EntityN } from '../../pages/homeMenuItems';

const keys = {
    tab: 9,
    enter: 13,
    escape: 27,
    space: 32,
    arrowUp: 38, arrowDown: 40,
    home: 36, end: 35,
    pageUp: 33, pageDown: 34
};

export function SummaryRow({
                               item, index, entityType, chooseItem,
                               rowFocus, UICues, elKey, // tableBodyRef
                           }) {
    const entityName = entityType.name;
    const logRoot = rootMkr(SummaryRow, entityName, item?.id);
    const {hasFocus, isSelected, hasVisualPriority, small, readOnly} = UICues;
    const row = useRef(null);

    const isNullRow = (small && item.id === 0);
    const isEntityTypeReadOnly = entityType.methods === 'R';
    const isRowOptional = (small && item.id === optionalIdValue);
    const isRowVisible = !isRowOptional || (isRowOptional && !isEntityTypeReadOnly);
    const selectedStyle = cx(
        isSelected ? summaryStyle.selected : null,
        isNullRow ? summaryStyle.nullRow : null
    );
    const {makeChoice} = useContext(ChoiceContext);
    elKey += `/SRow`;

    useEffect(function scrollAndFocusIfNecessary() {
        if (hasVisualPriority && isRowVisible)
            row.current.scrollIntoView({block: "center"});
        if (hasFocus) setFocus();
    });

    function setFocus() {
        row.current?.focus();
        rowFocus.set(index);
    }

    function choose() {
        if (!readOnly) {
            chooseItem(item);
            setFocus();
        }
    }

    function handleOnKeyDown(e) {
        // console.log(`e.keyCode=`, e.keyCode);
        // console.log(`e.key=`, e.key);
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

    function getProperty(object, propertyPath) {
        const logPath = pathMkr(logRoot, getProperty);
        const parts = propertyPath.split('.');
        switch (parts.length) {
            case 1:
                return object?.[parts[0]];
            case 2:
                return object?.[parts[0]]?.[parts[1]];
            case 3:
                return object?.[parts[0]]?.[parts[1]]?.[parts[2]];
            default:
                errv(logPath, {object, propertyPath, parts}, 'Too many parts.');
        }
    }

    function renderProperty(object, fieldPath) {
        // const logPath = pathMkr(logRoot, renderProperty);
        // const doLog = fieldPath.includes('image');
        const field = getProperty(object, fieldPath);
        // if (doLog) logv(logPath, {object, fieldPath, field});
        let fieldType = getFieldFromPath(entityTypes, entityType, fieldPath).type;
        // if (doLog) logv(null, {fieldType});
        if (fieldType === fieldTypes.img || fieldType === fieldTypes.file) {
            // logv(null, {object, fieldPath, field});
            return (field
                    ? <img src={endpoints.baseURL + entityTypes.file.downloadEndpoint(field)}
                           alt="thumbnail"/>
                    : <>--</>
            );
        }
        return field;
    }

    return (isRowVisible &&
        <tr onClick={choose}
            onKeyDown={handleOnKeyDown}
            ref={row}
            tabIndex={0}
            key={elKey}
            className={selectedStyle}
        >
            {entityType.summary.map((fieldPath) =>
                <td key={elKey + fieldPath}>
                    {(isNullRow)
                        ? '➖➖'
                        : (isRowOptional)
                            ? 'nieuw'
                            : renderProperty(item, fieldPath)
                    }
                </td>
            )}
            {(small && item.id && item.id !== optionalIdValue) ? (
                <td>
                    <span onClick={makeChoice({component: EntityN(entityType, item.id)})}
                          title={hints(`ga naar ${entityType.label}(${item.id})`)}
                    >
                        ➡
                    </span>
                </td>
            ) : (
                <td>&nbsp;</td>
            )}
        </tr>
    );
}

