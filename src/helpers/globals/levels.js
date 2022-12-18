import { logCondition, logv, pathMkr, rootMkr } from '../../dev/log';
const logRoot = rootMkr('levels');

export const levels = {
    ROLE_MEMBER: 1,
    ROLE_EXPERT: 2,
    ROLE_ADMIN: 3,
    ROLE_DEMIURG: 4,
}

export const authorities = {
    ROLE_MEMBER: 'ROLE_MEMBER',
    ROLE_EXPERT: 'ROLE_EXPERT',
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_DEMIURG: 'ROLE_DEMIURG',
    SELF: 'SELF',
}

authorities.USER = [authorities.ROLE_MEMBER, authorities.ROLE_EXPERT, authorities.ROLE_ADMIN];
authorities.PRIVATE = [authorities.SELF, authorities.ROLE_ADMIN]; // email, apiKey, ...


export const accessPurposes = {
    READ: 'read',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
};

accessPurposes.WRITE = [accessPurposes.CREATE, accessPurposes.UPDATE];

export const hasAccess = (userAuthorities = [], propertyAccess = [], purpose = 'read') => {
    const logPath = pathMkr(logRoot, hasAccess);
    const doLog = logCondition(hasAccess, purpose);
    if (Array.isArray(purpose)) {
        // console.log('multiple accessPurposes:', purpose);
        return purpose.some(p => hasAccess(userAuthorities, propertyAccess, p))
    }
    const requiredAuthorities = (propertyAccess?.[purpose])
        ? [propertyAccess[purpose]].flat(2)
        : [propertyAccess].flat(2);
    const forbiddenAuthorities = [propertyAccess?.forbidden?.[purpose] || []].flat(2);
    userAuthorities = [userAuthorities].flat(2);
    const isForbidden = userAuthorities?.some(ul => forbiddenAuthorities.includes(ul));
    const zeroLength = !(requiredAuthorities.length > 0);
    const someMatch = userAuthorities?.some(ul => requiredAuthorities.includes(ul));
    const canAccess = !isForbidden && (
        !(requiredAuthorities.length > 0)
        ||
        userAuthorities?.some(ul => requiredAuthorities.includes(ul))
    );
    if (doLog) logv(logPath, {userAuthorities, requiredAuthorities, forbiddenAuthorities, isForbidden, zeroLength, someMatch});
    return canAccess;
};

