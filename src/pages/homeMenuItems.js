import { Entity, Welcome } from '../components';
import { entityTypes } from '../helpers/globals/entityTypes';
import { Colors } from '../dev/Colors';
// import { OnFocusExample } from '../dev/OnFocusExample';
import { TestMultiSelect } from '../dev/TestMultiSelect';
import { TestCalculatingNumberInput } from '../dev/TestCalculatingNumberInput';
import { TestMultipartFile } from '../dev/TestMultipartFile';
import { Test } from '../dev/Test';
import { TestSorry } from '../dev/TestSorry';
import { authorities } from '../helpers/globals/levels';

// console.log('------------------------------------------------------\n', {entityTypes}, '\n------------------------------------------------------');

const EntityN = (entityType, n) => () => <Entity entityType={entityType} initialId={n}/>;

const dev = true;
const separator = true;

const makeEntityMenuItem = (entityType, n) => {
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

const homeMenuItems = {
    default: {label: {NL:'Welkom', EN: 'Welcome'}, component: Welcome},
    vessel: {...makeEntityMenuItem(entityTypes.vessel)},
    vesselType: {...makeEntityMenuItem(entityTypes.vesselType)},
    vesselTypeN21: {...makeEntityMenuItem(entityTypes.vesselType, 21), dev},
    hull: {...makeEntityMenuItem(entityTypes.hull)},
    country: {...makeEntityMenuItem(entityTypes.country)},
    address: {...makeEntityMenuItem(entityTypes.address)},
    subdivision: {...makeEntityMenuItem(entityTypes.subdivision)},
    unLocode: {...makeEntityMenuItem(entityTypes.unLocode)},
    unLocodeN360: {...makeEntityMenuItem(entityTypes.unLocode, 360), dev},
    organisation: {...makeEntityMenuItem(entityTypes.organisation)},
    relation: {...makeEntityMenuItem(entityTypes.relation)},
    relationType: {...makeEntityMenuItem(entityTypes.relationType)},
    propulsionType: {...makeEntityMenuItem(entityTypes.propulsionType)},
    operation: {...makeEntityMenuItem(entityTypes.operation)},
    operationType: {...makeEntityMenuItem(entityTypes.operationType)},
    sep0: {label: 'sep0', separator, access: authorities.USER},
    user: {...makeEntityMenuItem(entityTypes.user)},
    userN2: {...makeEntityMenuItem(entityTypes.user, 2), dev},
    role: {...makeEntityMenuItem(entityTypes.role), dev},
    sep1: {label: 'sep1', separator, dev},
    xyz: {...makeEntityMenuItem(entityTypes.xyz), dev},
    // xyzN3: {...makeEntityMenuItem(entityTypes.xyz, 3), dev},
    zyx: {...makeEntityMenuItem(entityTypes.zyx), dev},
    file: {...makeEntityMenuItem(entityTypes.file), dev},
    image: {...makeEntityMenuItem(entityTypes.image), dev},
    sep2: {label: 'sep2', separator, dev},
    colors: {label: {NL:'Kleuren', EN: 'Colors'}, component: Colors, dev},
    tms: {label: 'test multi-select', component: TestMultiSelect, dev},
    tstDict: {label: 'test useDict', component: Test, dev},
    TestMultipartFile: {label: {NL:'test bestandsupload', EN: 'test file upload'}, component: TestMultipartFile, dev},
    calcInput: {label: 'test calcInput', component: TestCalculatingNumberInput, dev},
    sorry: {label:'sorry', component: TestSorry, dev},
    // focus: {label: 'Focus', componentName: OnFocusExample},
};

homeMenuItems.displayOrder = Object.values(homeMenuItems);

export { homeMenuItems, EntityN };