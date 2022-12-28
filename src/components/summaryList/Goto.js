import React, { useContext } from 'react';
import { ChoiceContext, StorageContext } from '../../contexts';
import { hints, languageSelector, text } from '../../helpers';
import { EntityN } from '../../pages/homeMenuItems';
import { optionalIdValue } from './SummaryListSmall';

const messages = {
    NL: {
        goto: 'ga naar'
    },
    EN: {
        goto: 'go to'
    }
};

export function Goto({accessStatus, entityType, itemId}) {
    const entityName = entityType.name;
    const {makeChoice} = useContext(ChoiceContext);
    const storage = useContext(StorageContext);
    const entry = storage.getEntry(entityName, itemId);
    const arrowStyle = entry?.isEmpty ? {color: 'red', fontSize: 'larger'} : null;

    const TXT = messages[languageSelector()];

    if (accessStatus.toEntity() && itemId && itemId !== optionalIdValue)
        return (
            <span onClick={makeChoice({component: EntityN(entityType, itemId)})}
                  title={hints(`${TXT.goto} ${text(entityType.label)}(${itemId})`)}
            >
                <span style={arrowStyle}>➡</span>
            </span>
        )
    else
        return null;
}