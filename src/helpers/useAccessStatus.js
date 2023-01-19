import { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts';
import { entityTypes, getTypeFieldFromPath } from './globals/entityTypes';
import { hasAccess } from './globals/levels';
import { logCondition, logv, pathMkr, rootMkr } from '../dev/log';

export function useAccessStatus(entityName, parentName, item) {
    const logRoot = rootMkr(useAccessStatus, entityName);
    const doLog = logCondition(useAccessStatus, entityName, parentName);
    const authorization = useContext(AuthContext);
    const isEligible = useMemo(() => authorization.isEligibleToChange(item), [item, authorization]);
    const userAuthorities = useMemo(() => authorization.getUserAuthorities(item), [item, authorization]);
    let fields, toEntity;
    if (entityName) {
        const entityType = entityTypes[entityName];
        fields = entityType.summary.map(fieldPath => {
            const typeField = getTypeFieldFromPath(entityTypes, entityType, fieldPath);
            const isVisible = (fieldPath.split('.')[0] !== parentName && hasAccess(userAuthorities, typeField?.access));
            return {fieldPath, typeField, isVisible};
        });
        toEntity = (purpose) => {
            const hasAccess1 = hasAccess(userAuthorities, entityType.access, purpose);
            if (doLog) logv(pathMkr(logRoot, toEntity, purpose), {hasAccess1});
            return hasAccess1;
        };
    }
    const status = {authorization, userAuthorities, isEligible, fields, toEntity};
    if (doLog) logv(logRoot, {item, status});
    return status;
}
