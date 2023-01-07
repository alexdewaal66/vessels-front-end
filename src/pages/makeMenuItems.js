import { Entity } from '../components';

// console.log('------------------------------------------------------\n', {entityTypes}, '\n------------------------------------------------------');

export const EntityN = (entityType, n) => () => <Entity entityType={entityType} initialId={n}/>;

export function makeEntityMenuItem(entityType, n) {
    let label = entityType.label;
    if (typeof n !== 'undefined')
        label = {
            NL: `\u00A0\u00A0- ${label.NL}(${n})`,
            EN: `\u00A0\u00A0- ${label.EN}(${n})`,
        };
    return {
        label,
        component: EntityN(entityType, n),
        access: entityType.access,
    }
}
