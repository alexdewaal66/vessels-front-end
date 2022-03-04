import { Test } from '../dev/Test';
import { Entity, Search, Welcome } from '../components';
import { entityTypes } from '../helpers';
import { Colors } from '../dev/Colors';
import { OnFocusExample } from '../dev/OnFocusExample';
import { TestMultiSelect } from '../dev/TestMultiSelect';
import { TestMultipartFile } from '../dev/TestMultipartFile';

const EntityN = (entityType, n) => () => <Entity entityType={entityType} initialId={n}/>;

const homeMenuItems = {
    default: {label: 'Welkom', component: Welcome},
    vessel: {label: 'Vaartuig', component: EntityN(entityTypes.vessel)},
    vesselType: {label: 'Scheepstype', component: EntityN(entityTypes.vesselType)},
    hull: {label: 'Romp', component: EntityN(entityTypes.hull)},
    user: {label: 'Gebruiker', component: EntityN(entityTypes.user)},
    userN0: {label: 'Gebruiker(0)', component: EntityN(entityTypes.user, 0)},
    country: {label: 'Land', component: EntityN(entityTypes.country)},
    address: {label: 'Adres', component: EntityN(entityTypes.address)},
    subdivision: {label: 'Deelsector', component: EntityN(entityTypes.subdivision)},
    unLocode: {label: "Locatiecode", component: EntityN(entityTypes.unLocode)},
    unLocodeN360: {label: "Locatiecode(360)", component: EntityN(entityTypes.unLocode, 360)},
    organisation: {label: 'Organisatie', component: EntityN(entityTypes.organisation)},
    relation: {label: 'Relatie', component: EntityN(entityTypes.relation)},
    relationType: {label: 'Soort Relatie', component: EntityN(entityTypes.relationType)},
    tms: {label: 'test multi-select', component: TestMultiSelect},
    tstDict: {label: 'test useDict', component: Test},
    search: {label: 'Zoek', component: Search},
    xyz: {label: 'Xyz', component: EntityN(entityTypes.xyz)},
    xyzN3: {label: 'Xyz(3)', component: EntityN(entityTypes.xyz, 3)},
    zyx: {label: 'Zyx', component: EntityN(entityTypes.zyx)},
    colors: {label: 'Kleuren', component: Colors},
    focus: {label: 'Focus', component: OnFocusExample},
    file: {label: 'Bestand', component: TestMultipartFile},
    image: {label: 'Plaatje', component: EntityN(entityTypes.image)},
};

homeMenuItems.displayOrder = Object.keys(homeMenuItems).map(key => homeMenuItems[key]);

export { homeMenuItems, EntityN };