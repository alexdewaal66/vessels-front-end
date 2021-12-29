import { Test } from '../dev/Test';
import { Entity, Search, Welcome } from '../components';
import { entitiesMetadata } from '../helpers';
import { Colors } from '../dev/Colors';
import { OnFocusExample } from '../dev/OnFocusExample';
import { TestMultiSelect } from '../dev/TestMultiSelect';

const EntityN = (metadata, n) => () => <Entity metadata={metadata} initialIdList={[n]}/>;

const homeCommands = {
    default: {label: 'Welkom', component: Welcome},
    vessel: {label: 'Vaartuig', component: EntityN(entitiesMetadata.vessel)},
    vesselType: {label: 'Scheepstype', component: EntityN(entitiesMetadata.vesselType)},
    hull: {label: 'Romp', component: EntityN(entitiesMetadata.hull)},
    userN0: {label: 'Gebruiker(0)', component: EntityN(entitiesMetadata.user, 0)},
    country: {label: 'Land', component: EntityN(entitiesMetadata.country)},
    address: {label: 'Adres', component: EntityN(entitiesMetadata.address)},
    subdivision: {label: 'Deelsector', component: EntityN(entitiesMetadata.subdivision)},
    unLocode: {label: "Locatiecode", component: EntityN(entitiesMetadata.unLocode)},
    unLocodeN360: {label: "Locatiecode(360)", component: EntityN(entitiesMetadata.unLocode, 360)},
    organisation: {label: 'Organisatie', component: EntityN(entitiesMetadata.organisation)},
    relation: {label: 'Relatie', component: EntityN(entitiesMetadata.relation)},
    relationType: {label: 'Soort Relatie', component: EntityN(entitiesMetadata.relationType)},
    tms: {label: 'test multi-select', component: TestMultiSelect},
    tstDict: {label: 'test useDict', component: Test},
    search: {label: 'Zoek', component: Search},
    xyz: {label: 'Xyz', component: EntityN(entitiesMetadata.xyz)},
    xyzN3: {label: 'Xyz(3)', component: EntityN(entitiesMetadata.xyz, 3)},
    zyx: {label: 'Zyx', component: EntityN(entitiesMetadata.zyx)},
    colors: {label: 'Kleuren', component: Colors},
    focus: {label: 'Focus', component: OnFocusExample},
};

homeCommands.displayOrder = Object.keys(homeCommands).map(key => homeCommands[key]);

export { homeCommands, EntityN };