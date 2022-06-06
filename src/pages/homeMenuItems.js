import { Entity, Welcome } from '../components';
import { entityTypes } from '../helpers';
import { Colors } from '../dev/Colors';
// import { OnFocusExample } from '../dev/OnFocusExample';
// import { Test } from '../dev/Test';
import { TestMultiSelect } from '../dev/TestMultiSelect';
import { TestCalculatingNumberInput } from '../dev/TestCalculatingNumberInput';
// import { TestMultipartFile } from '../dev/TestMultipartFile';

const EntityN = (entityType, n) => () => <Entity entityType={entityType} initialId={n}/>;

const dev = true;

const homeMenuItems = {
    default: {label: 'Welkom', component: Welcome},
    vessel: {label: 'Vaartuig', component: EntityN(entityTypes.vessel)},
    vesselType: {label: 'Scheepstype', component: EntityN(entityTypes.vesselType)},
    hull: {label: 'Romp', component: EntityN(entityTypes.hull)},
    user: {label: 'Gebruiker', component: EntityN(entityTypes.user)},
    // userN0: {label: 'Gebruiker(0)', component: EntityN(entityTypes.user, 0)},
    country: {label: 'Land', component: EntityN(entityTypes.country)},
    address: {label: 'Adres', component: EntityN(entityTypes.address)},
    subdivision: {label: 'Deelsector', component: EntityN(entityTypes.subdivision)},
    unLocode: {label: "Locatiecode", component: EntityN(entityTypes.unLocode)},
    // unLocodeN360: {label: "Locatiecode(360)", component: EntityN(entityTypes.unLocode, 360)},
    organisation: {label: 'Organisatie', component: EntityN(entityTypes.organisation)},
    relation: {label: 'Relatie', component: EntityN(entityTypes.relation)},
    relationType: {label: 'Soort Relatie', component: EntityN(entityTypes.relationType)},
    propulsionType: {label: 'Soort Voortstuwing', component: EntityN(entityTypes.propulsionType)},
    tms: {label: 'test multi-select', component: TestMultiSelect, dev},
    // tstDict: {label: 'test useDict', component: Test},
    // search: {label: 'Zoek', component: Search},
    xyz: {label: 'Xyz', component: EntityN(entityTypes.xyz), dev},
    // xyzN3: {label: 'Xyz(3)', component: EntityN(entityTypes.xyz, 3)},
    zyx: {label: 'Zyx', component: EntityN(entityTypes.zyx), dev},
    colors: {label: 'Kleuren', component: Colors, dev: true},
    emptyFile: {label: 'Leeg bestand', component: EntityN(entityTypes.file), dev},
    // focus: {label: 'Focus', component: OnFocusExample},
    // file: {label: 'Bestand', component: TestMultipartFile},
    // image: {label: 'Plaatje', component: EntityN(entityTypes.image)},
    calcInput: {label: 'calcInput', component: TestCalculatingNumberInput, dev},
};

homeMenuItems.displayOrder = Object.values(homeMenuItems);

export { homeMenuItems, EntityN };