import { Test } from '../dev/Test';
import { Entity, Search, Vessel } from '../components';
import { entitiesMetadata } from '../helpers/entitiesMetadata';
import { Colors } from '../dev/Colors';
import { OnFocusExample } from '../dev/OnFocusExample';
import { TestMultiSelect } from '../dev/TestMultiSelect';

// curried component just for fun
const EntityN = (metadata, n) => () => <Entity metadata={metadata} initialId={n}/>;

const homeCommands = {
    tms: {label: 'test multi-select', component: TestMultiSelect},
    empty: {label: 'test useDict', component: Test},
    search: {label: 'Zoek', component: Search},
    vessels: {label: 'Vaartuig', component: EntityN(entitiesMetadata.vessel)},
    default: {label: 'Entity', component: Entity},
    xyzN3: {label: 'Xyz(3)', component: EntityN(entitiesMetadata.xyz, 3)},
    zyx: {label: 'Zyx', component: EntityN(entitiesMetadata.zyx)},
    userN0: {label: 'Gebruiker(0)', component: EntityN(entitiesMetadata.user, 0)},
    countries: {label: 'Land', component: EntityN(entitiesMetadata.country)},
    addresses: {label: 'Adres', component: EntityN(entitiesMetadata.address)},
    subdivisions: {label: 'Deelsector', component: EntityN(entitiesMetadata.subdivision)},
    unLocode: {label: "Locatiecode", component: EntityN(entitiesMetadata.unLocode)},
    unLocodeN360: {label: "Locatiecode(360)", component: EntityN(entitiesMetadata.unLocode, 360)},
    vesselTypes: {label: 'Scheepstype', component: EntityN(entitiesMetadata.vesselType)},
    hulls: {label: 'Romp', component: EntityN(entitiesMetadata.hull)},
    colors: {label: 'Kleuren', component: Colors},
    focus: {label: 'Focus', component: OnFocusExample},
};

homeCommands.displayOrder = Object.keys(homeCommands).map(key => homeCommands[key]);

export { homeCommands, EntityN };