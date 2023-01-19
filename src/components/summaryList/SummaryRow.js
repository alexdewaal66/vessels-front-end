import React, { useEffect, useRef } from 'react';
import { optionalIdValue, summaryStyle } from './index';
import { errv, logCondition, logv, pathMkr, rootMkr } from '../../dev/log';
import { entityTypes, fieldTypes, getTypeFieldFromPath } from '../../helpers/globals/entityTypes';
import { cx, devHints, endpoints, languageSelector } from '../../helpers';
import { Goto } from './Goto';
import { keyCodes } from '../../helpers/globals/keyCodes';

const messages = {
    NL: {
        new: 'nieuw',
    },
    EN: {
        new: 'new',
    }
};


export function SummaryRow({
                               item, index, entityType, chooseItem,
                               rowFocus, UICues, elKey, accessStatus
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
    elKey += `/SRow`;

    const TXT = messages[languageSelector()];

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
            case keyCodes.enter:
            case keyCodes.space:
                choose();
                return;
            case keyCodes.escape:
                row.current?.blur();
                return;
            case keyCodes.arrowUp:
                rowFocus.up();
                break;
            case keyCodes.arrowDown:
                rowFocus.down();
                break;
            case keyCodes.pageUp:
                rowFocus.tenUp();
                break;
            case keyCodes.pageDown:
                rowFocus.tenDown();
                break;
            case keyCodes.home:
                rowFocus.first();
                break;
            case keyCodes.end:
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
        const logPath = pathMkr(logRoot, renderProperty);
        const doLog = logCondition(renderProperty.name, fieldPath);
        const field = getProperty(object, fieldPath);
        if (doLog) logv(logPath, {object, fieldPath, field});
        if (!field) return null;

        const typeField = getTypeFieldFromPath(entityTypes, entityType, fieldPath);
        let fieldType = typeField.type;
        if (doLog) logv(null, {typeField});
        if (fieldType === fieldTypes.img || fieldType === fieldTypes.file) {
            if (doLog) logv(null, {object, fieldPath, field});
            return (field
                    ? <img src={endpoints.baseURL + entityTypes.file.downloadEndpoint(field.id)}
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
            style={readOnly ? {cursor: 'default'} : {cursor: 'pointer'}}
            title={devHints('readOnly=' + readOnly)}
            // aria-readonly={readOnly}
        >
            {accessStatus.fields.map(({fieldPath, isVisible}) => {
                if (isVisible)
                    return (<td key={elKey + fieldPath}>
                        {(isNullRow)
                            ? '➖➖'
                            : (isRowOptional)
                                ? TXT.new
                                : renderProperty(item, fieldPath)
                        }
                    </td>);
                else return null;
            })}
            {(small) ? (
                <td>
                    <Goto accessStatus={accessStatus} entityType={entityType} itemId={item?.id}/>
                </td>
            ) : (
                <td>&nbsp;</td>
            )}
        </tr>
    );
}


