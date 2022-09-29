import { Entity, Welcome } from '../components';
import { entityTypes } from '../helpers';
import { Colors } from '../dev/Colors';
// import { OnFocusExample } from '../dev/OnFocusExample';
import { TestMultiSelect } from '../dev/TestMultiSelect';
import { TestCalculatingNumberInput } from '../dev/TestCalculatingNumberInput';
import { TestMultipartFile } from '../dev/TestMultipartFile';
import { Test } from '../dev/Test';

const EntityN = (entityType, n) => () => <Entity entityType={entityType} initialId={n}/>;

const dev = true;
const separator = true;

const homeMenuItems = {
    // testType: {label: 'Testtype', component: EntityN(entityTypes.testType), dev},
    // sep0: {label: 'sep1', separator, dev},
    default: {label: 'Welkom', component: Welcome},
    vessel: {label: 'Vaartuig', component: EntityN(entityTypes.vessel)},
    vesselType: {label: 'Scheepstype', component: EntityN(entityTypes.vesselType)},
    hull: {label: 'Romp', component: EntityN(entityTypes.hull)},
    user: {label: 'Gebruiker', component: EntityN(entityTypes.user)},
    // userN0: {label: '\u00A0\u00A0- Gebruiker(0)', componentName: EntityN(entityTypes.user, 0), dev},
    role: {label: '»» Rol ««', component: EntityN(entityTypes.role)},
    country: {label: 'Land', component: EntityN(entityTypes.country)},
    address: {label: 'Adres', component: EntityN(entityTypes.address)},
    subdivision: {label: 'Deelsector', component: EntityN(entityTypes.subdivision)},
    unLocode: {label: "Locatiecode", component: EntityN(entityTypes.unLocode)},
    unLocodeN360: {label: "\u00A0\u00A0- Locatiecode(360)", component: EntityN(entityTypes.unLocode, 360), dev},
    organisation: {label: 'Organisatie', component: EntityN(entityTypes.organisation)},
    relation: {label: 'Relatie', component: EntityN(entityTypes.relation)},
    relationType: {label: 'Soort Relatie', component: EntityN(entityTypes.relationType)},
    propulsionType: {label: 'Soort Voortstuwing', component: EntityN(entityTypes.propulsionType)},
    sep1: {label: 'sep1', separator, dev},
    xyz: {label: 'Xyz', component: EntityN(entityTypes.xyz), dev},
    // xyzN3: {label: 'Xyz(3)', componentName: EntityN(entityTypes.xyz, 3)},
    zyx: {label: 'Zyx', component: EntityN(entityTypes.zyx), dev},
    file: {label: 'Bestand', component: EntityN(entityTypes.file), dev},
    image: {label: 'Plaatje', component: EntityN(entityTypes.image), dev},
    // search: {label: 'Zoek', componentName: Search},
    sep2: {label: 'sep2', separator, dev},
    colors: {label: 'Kleuren', component: Colors, dev},
    tms: {label: 'test multi-select', component: TestMultiSelect, dev},
    tstDict: {label: 'test useDict', component: Test, dev},
    TestMultipartFile: {label: 'test bestandsupload', component: TestMultipartFile, dev},
    calcInput: {label: 'calcInput', component: TestCalculatingNumberInput, dev},
    // focus: {label: 'Focus', componentName: OnFocusExample},
};

homeMenuItems.displayOrder = Object.values(homeMenuItems);

export { homeMenuItems, EntityN };