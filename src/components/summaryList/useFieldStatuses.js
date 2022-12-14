import { useContext, useMemo } from 'react';
import { AuthContext } from '../../contexts';
import { entityTypes, getTypeFieldFromPath } from '../../helpers/globals/entityTypes';
import { hasAccess } from '../../helpers/globals/levels';

export function useFieldStatuses(entityName, parentName) {
    const entityType = entityTypes[entityName];
    const authorization = useContext(AuthContext);
    const userAuthorities = useMemo(() => authorization.getRoles(), [authorization]);
    return entityType.summary.map(fieldPath => {
        const typeField = getTypeFieldFromPath(entityTypes, entityType, fieldPath);
        const isVisible = (fieldPath.split('.')[0] !== parentName && hasAccess(userAuthorities, typeField?.access));
        return {fieldPath, typeField, isVisible};
    });
}
