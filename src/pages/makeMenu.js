import { Entity } from '../components';
import { logCondition, logv, pathMkr } from '../dev/log';
import { entityTypes, initializeEntityTypes } from '../helpers/globals/entityTypes';

// console.log('------------------------------------------------------\n', {entityTypes}, '\n------------------------------------------------------');
const logRoot = 'makeMenu.js';

export const EntityN = (entityType, n) => () => <Entity entityType={entityType} initialId={n}/>;

export function makeEntityMenuItem(entityType, id = 0) {
    let label = entityType.label;
    if (id !== 0)
        label = {
            NL: `\u00A0\u00A0- ${label.NL}(${id})`,
            EN: `\u00A0\u00A0- ${label.EN}(${id})`,
        };
    const name = entityType.name;
    return {
        label,
        Component: EntityN(entityType, id),
        access: entityType.access,
        hints: entityType.hints,
        name,
        id,
        path: name + '/:entityItemId',
    };
}

export function makeMenu(pageName, menuDefinition) {
    const logPath = pathMkr(logRoot, makeMenu, '↓');
    const doLog = logCondition('makeMenu', pageName);
    if (doLog) logv(logPath, {menuDefinition});

    initializeEntityTypes(entityTypes);

    const menu = menuDefinition.map(itemDefinition => {
        const {entityType, id} = itemDefinition;
        let menuItem = {};
        let madeItem = {};
        let validCase = '';
        if (!!entityType) {
            validCase = 'entityType';
            madeItem = makeEntityMenuItem(entityType, id);
            menuItem = {...itemDefinition, ...madeItem};
        } else {
            validCase = 'as is';
            menuItem = itemDefinition;
        }
        if (doLog) logv(logPath, {itemDefinition, madeItem, menuItem, validCase});
        return menuItem;
    });
    menu.pageName = pageName;
    if (doLog) logv(logPath, {menu});
    return menu;
}