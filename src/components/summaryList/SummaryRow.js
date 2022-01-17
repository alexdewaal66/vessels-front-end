import React, { useContext, useEffect, useRef } from 'react';
import { summaryStyle } from './index';
import { logv } from '../../dev/log';
import { cx, endpoints, getSummaryProp, types } from '../../helpers';
import { ChoiceContext } from '../../contexts/ChoiceContext';
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
                               listItem, index, metadata, chooseItem,
                               rowFocus, UICues, elKey
                           }) {
    const logRoot = SummaryRow.name + `(${metadata.name}«${listItem.id}»)`;
    const {hasFocus, isSelected, hasVisualPriority, small} = UICues;
    const row = useRef(null);
    const isNullRow = (small && listItem.id === 0);
    const selectedStyle = cx(
        isSelected ? summaryStyle.selected : null,
        isNullRow ? summaryStyle.nullRow : null
    );
    const {makeChoice} = useContext(ChoiceContext);
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
        chooseItem(listItem);
        setFocus();
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

    function getProperty(object, propertyName) {
        const parts = propertyName.split('.');
        return (parts.length === 1)
            ? object?.[parts[0]]
            : object?.[parts[0]]?.[parts[1]];
    }

    function renderProperty(object, propertyName) {
        const logPath = `🖍🖍🖍🖍 ${logRoot} » ${renderProperty.name}()`;
        const property = getProperty(object, propertyName);
        // logv(logPath, {object, propertyName, property});
        const propType = getSummaryProp(metadata, propertyName).type;
        // logv(logPath, {propType});
        if (propType === types.img) {
            logv(logPath, {object, propertyName, property});
            return (
                <img src={endpoints.baseURL + 'files/' + property}
                     alt="thumbnail"
                />
            );
        }
        return property;
    }

    return (
        <tr onClick={choose}
            onKeyDown={handleOnKeyDown}
            ref={row}
            tabIndex={0}
            key={elKey}
            className={selectedStyle}
        >
            {metadata.summary.map((propertyName) =>
                <td key={elKey + propertyName}>
                    {(isNullRow)
                        ? '➖➖'
                        : renderProperty(listItem, propertyName)}
                </td>
            )}
            {small && listItem.id ? (
                <td>
                    <span onClick={makeChoice({component: EntityN(metadata, listItem.id)})}>
                        ➡
                    </span>
                </td>
            ) : (
                <td>&nbsp;</td>
            )}
        </tr>
    );
}

