import React, { useContext } from 'react';
import { StorageContext } from '../../contexts';
import { hints, languageSelector, text } from '../../helpers';
import { optionalIdValue } from './SummaryListSmall';
import { Link, useLocation } from 'react-router-dom';
import { logCondition, logv, rootMkr } from '../../dev/log';
import { summaryStyle } from './index';

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
    const logRoot = rootMkr(Goto, entityName, itemId);
    const doLog = logCondition(Goto, entityName + itemId);

    const location = useLocation();
    const pagePath = '/' + location.pathname.split('/')[1];
    const targetPath = pagePath + '/' + entityName + '/' + itemId;
    if (doLog) logv(logRoot, {entityName, location, targetPath});
    const storage = useContext(StorageContext);
    const entry = storage.getEntry(entityName, itemId);
    const arrowStyle = entry?.isEmpty ? {color: 'red', fontSize: 'larger'} : null;

    const TXT = messages[languageSelector()];

    if (accessStatus.toEntity() && itemId && itemId !== optionalIdValue)
        return (
            <Link to={targetPath} className={summaryStyle.goto}
                  title={hints(`${TXT.goto} ${text(entityType.label)}(${itemId})`)}
            >
                <span style={arrowStyle}>➡</span>
            </Link>
        )
    else
        return null;
}
