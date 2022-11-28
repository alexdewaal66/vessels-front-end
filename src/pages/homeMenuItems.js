import { Entity, Welcome } from '../components';
import { entityTypes } from '../helpers/globals/entityTypes';
import { Colors } from '../dev/Colors';
// import { OnFocusExample } from '../dev/OnFocusExample';
import { TestMultiSelect } from '../dev/TestMultiSelect';
import { TestCalculatingNumberInput } from '../dev/TestCalculatingNumberInput';
import { TestMultipartFile } from '../dev/TestMultipartFile';
import { Test } from '../dev/Test';
import { TestSorry } from '../dev/TestSorry';

console.log('------------------------------------------------------', {entityTypes}, '------------------------------------------------------');

const EntityN = (entityType, n) => () => <Entity entityType={entityType} initialId={n}/>;

const dev = true;
const separator = true;

const homeMenuItems = {
    // sep0: {label: 'sep1', separator, dev},
    default: {label: {NL:'Welkom', EN: 'Welcome'}, component: Welcome},
    vessel: {label: {NL: 'Vaartuig', EN: 'Vessel'}, component: EntityN(entityTypes.vessel)},
    vesselType: {label: {NL: 'Scheepstype', EN: 'Ship type'}, component: EntityN(entityTypes.vesselType)},
    hull: {label: {NL: 'Romp', EN: 'Hull'}, component: EntityN(entityTypes.hull)},
    user: {label: {NL: 'Gebruiker', EN: 'User'}, component: EntityN(entityTypes.user)},
    userN2: {label: {NL: '\u00A0\u00A0- Gebruiker(2)', EN: '\u00A0\u00A0- User(2)'}, component: EntityN(entityTypes.user, 2), dev},
    role: {label: {NL: 'Rol', EN: 'Role'}, component: EntityN(entityTypes.role), dev},
    country: {label: {NL:'Land', EN: 'Country'}, component: EntityN(entityTypes.country)},
    address: {label: {NL:'Adres', EN: 'Address'}, component: EntityN(entityTypes.address)},
    subdivision: {label: {NL:'Deelsector', EN: 'Subdivision'}, component: EntityN(entityTypes.subdivision)},
    unLocode: {label: {NL: "Locatiecode", EN: 'Location code'}, component: EntityN(entityTypes.unLocode)},
    unLocodeN360: {label: {NL: '\u00A0\u00A0- Locatiecode(360)', EN: '\u00A0\u00A0- Location code(360)'}, component: EntityN(entityTypes.unLocode, 360), dev},
    organisation: {label: {NL:'Organisatie', EN: 'Organisation'}, component: EntityN(entityTypes.organisation)},
    relation: {label: {NL:'Relatie', EN: 'Relation'}, component: EntityN(entityTypes.relation)},
    relationType: {label: {NL:'Soort Relatie', EN: 'Relation type'}, component: EntityN(entityTypes.relationType)},
    propulsionType: {label: {NL:'Soort Voortstuwing', EN: 'Propulsion type'}, component: EntityN(entityTypes.propulsionType)},
    operation: {label: {NL: 'Beheer', EN: 'Management'}, component: EntityN(entityTypes.operation)},
    operationType: {label: {NL: 'Beheerrol', EN: 'Management role'}, component: EntityN(entityTypes.operationType)},
    sep1: {label: 'sep1', separator, dev},
    xyz: {label: 'Xyz', component: EntityN(entityTypes.xyz), dev},
    // xyzN3: {label: '\u00A0\u00A0- Xyz(3)', component: EntityN(entityTypes.xyz, 3), dev},
    zyx: {label: 'Zyx', component: EntityN(entityTypes.zyx), dev},
    file: {label: {NL:'Bestand', EN: 'File'}, component: EntityN(entityTypes.file), dev},
    image: {label: {NL:'Afbeelding', EN: 'Image'}, component: EntityN(entityTypes.image), dev},
    // search: {label: {NL:'Zoek', EN: 'Search'}, componentName: Search},
    sep2: {label: 'sep2', separator, dev},
    colors: {label: {NL:'Kleuren', EN: 'Colors'}, component: Colors, dev},
    tms: {label: 'test multi-select', component: TestMultiSelect, dev},
    tstDict: {label: 'test useDict', component: Test, dev},
    TestMultipartFile: {label: {NL:'test bestandsupload', EN: 'test file upload'}, component: TestMultipartFile, dev},
    calcInput: {label: 'calcInput', component: TestCalculatingNumberInput, dev},
    sorry: {label:'sorry', component: TestSorry, dev},
    // focus: {label: 'Focus', componentName: OnFocusExample},
};

homeMenuItems.displayOrder = Object.values(homeMenuItems);

export { homeMenuItems, EntityN };