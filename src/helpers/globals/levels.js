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

export const hasAccess = (userAuthorities = [], fieldAccess = [], purpose = 'read') => {
    if (Array.isArray(purpose)) {
        // console.log('multiple accessPurposes:', purpose);
        return purpose.some(p => hasAccess(userAuthorities, fieldAccess, p))
    }
    const requiredAuthorities = (fieldAccess?.[purpose])
        ? [fieldAccess[purpose]].flat(2)
        : [fieldAccess].flat(2);
    const forbiddenAuthorities = [fieldAccess?.forbidden?.[purpose] || []].flat(2);
    userAuthorities = [userAuthorities].flat(2);
    const isForbidden = userAuthorities?.some(ul => forbiddenAuthorities.includes(ul));
    // console.log({requiredAuthorities, forbiddenAuthorities, isForbidden});
    return !isForbidden && (
        !(requiredAuthorities.length > 0)
        ||
        userAuthorities?.some(ul => requiredAuthorities.includes(ul))
    );
};

