import React, { useContext } from 'react';
import { StorageContext } from '../../contexts';
import { errv, logCondition, logv, pathMkr, rootMkr } from '../../dev/log';
import { entityTypes, fieldTypes, getTypeFieldFromPath } from '../../helpers/globals/entityTypes';
import { endpoints, hints, languageSelector } from '../../helpers';
import { summaryStyle } from './index';
import { useAccessStatus } from '../../helpers/useAccessStatus';
import { Goto } from './Goto';

const messages = {
    NL: {
        toggle: 'inklappen/uitklappen',
    },
    EN: {
        toggle: 'collapse/expand',
    }
};

export function SummaryLine({
                                entityType, initialIdList,
                                elKey, toggleCollapsed, parentName
                            }) {
    elKey += '/SummaryLine';
    const entityName = entityType.name;
    const logRoot = rootMkr(SummaryLine, entityName);
    const doLog = logCondition(SummaryLine, entityName);
    const storage = useContext(StorageContext);
    const item = storage.getItem(entityName, initialIdList[0]);
    const isNullRow = (item?.id === 0);

    const accessStatus = useAccessStatus(entityName, parentName);

    const TXT = messages[languageSelector()];

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
        // const doLog = fieldPath.includes('image');
        const field = getProperty(object, fieldPath);
        if (doLog) logv(logPath, {object, fieldPath, field});
        if (!field) return null;

        let fieldType = getTypeFieldFromPath(entityTypes, entityType, fieldPath).type;
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

    function fieldLabel(fieldPath) {
        const field = getTypeFieldFromPath(entityTypes, entityType, fieldPath);
        return entityType.summaryLabel?.[fieldPath] || field.label;
    }

    return <>
        <table className={summaryStyle.table} tabIndex={0}>
            <thead>
            <tr onClick={toggleCollapsed}
                style={{cursor: 'pointer'}}
                title={hints(TXT.toggle)}
            >
                {accessStatus.fields.map(({fieldPath, isVisible}) => {
                    if (isVisible)
                        return (
                            <th key={elKey + fieldPath} style={{fontWeight: 'normal'}}
                                title={hints(fieldLabel(fieldPath))}
                            >
                                {(isNullRow)
                                    ? '➖➖'
                                    : renderProperty(item, fieldPath)
                                }
                            </th>
                        )
                    else
                        return null;
                })}

                <th style={{textAlign: 'right'}}>
                    <Goto accessStatus={accessStatus} entityType={entityType} itemId={item?.id}/>
                    &nbsp;
                    ≣
                </th>
            </tr>
            </thead>
        </table>
    </>;
}
