import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import SignOut from './SignOut';
import { Search, Vessel, Entity } from '../components';
import { Empty } from '../dev/Empty';
import { Colors } from '../dev/Colors';
import { OnFocusExample } from '../dev/OnFocusExample';
import { entitiesMetadata } from '../helpers/entitiesMetadata';

const pages = {
    home: {name: 'Home', path: '/', component: Home, exact: true, isVisible: () => true, },
    profile: {name: 'Profiel', path: '/profile', component: Profile, isVisible: user => !!user, },
    signUp: {name: 'Registreren', path: '/signup', component: SignUp, isVisible: user => !user, },
    signIn: {name: 'Inloggen', path: '/signin', component: SignIn, isVisible: user => !user, },
    signOut: {name: 'Uitloggen', path: '/signout', component: SignOut, isVisible: user => !!user, },
};

pages.displayOrder = [
    pages.home,
    pages.signUp,
    pages.signIn,
    pages.signOut,
    pages.profile,
];

// curried component just for fun
const EntityN = (entity, n) => () => <Entity entity={entity} initialId={n} />;

const homeCommands = {
    empty: {label: 'test useDict', component: Empty},
    search: {label: 'Zoek', component: Search},
    vessels: {label: 'Vaartuigen', component: Vessel},
    xyz: {label: 'Entity', component: Entity},
    xyzN3: {label: 'Xyz(3)', component: EntityN(entitiesMetadata.xyz,3)},
    xyzN4: {label: 'Xyz(4)', component: EntityN(entitiesMetadata.xyz,4)},
    zyx: {label: 'Zyx', component: EntityN(entitiesMetadata.zyx)},
    users: {label: 'Gebruikers', component: EntityN(entitiesMetadata.user, 0)},
    countries: {label: 'Landen', component: EntityN(entitiesMetadata.country)},
    subdivisions: {label: 'Deelsector', component: EntityN(entitiesMetadata.subdivision)},
    unLocode: {label: "Locatiecode", component: EntityN(entitiesMetadata.unLocode)},
    vesselTypes: {label: 'Scheepstypes', component: EntityN(entitiesMetadata.vesselType)},
    colors: {label: 'Kleuren', component: Colors},
    focus: {label: 'Focus', component: OnFocusExample},
};

homeCommands.displayOrder = [
    homeCommands.empty,
    homeCommands.search,
    homeCommands.vessels,
    homeCommands.users,
    homeCommands.xyz,
    homeCommands.xyzN3,
    homeCommands.xyzN4,
    homeCommands.zyx,
    homeCommands.countries,
    homeCommands.subdivisions,
    homeCommands.unLocode,
    homeCommands.vesselTypes,
    homeCommands.colors,
    homeCommands.focus,
];



export { Home, SignUp, SignIn, SignOut, Profile, EntityN, pages, homeCommands };