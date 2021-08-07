import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import SignOut from './SignOut';
import { Search, Vessel, Xyz } from '../components';
import { Empty } from '../dev/Empty';
import { Colors } from '../dev/Colors';
import { entities } from '../helpers/entities';

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
const EntityN = (entity, n) => () => <Xyz entity={entity} id={n} />;

const homeCommands = {
    empty: {name: 'leeg', component: Empty},
    search: {name: 'Zoek', component: Search,},
    vessels: {name: 'Vaartuigen', component: Vessel,},
    xyz: {name: 'Xyz', component: Xyz,},
    xyzN: {name: 'Xyz(3)', component: EntityN(entities.xyz,3),},
    users: {name: 'Gebruikers', component: EntityN(entities.user, 0),},
    countries: {name: 'Landen', component: EntityN(entities.country),},
    vesselTypes: {name: 'Scheepstypes', component: EntityN(entities.vesselType)},
    colors: {name: 'Kleuren', component: Colors,},
};

homeCommands.displayOrder = [
    homeCommands.search,
    homeCommands.vessels,
    homeCommands.users,
    homeCommands.xyz,
    homeCommands.xyzN,
    homeCommands.countries,
    homeCommands.vesselTypes,
    homeCommands.colors,
];



export { Home, SignUp, SignIn, SignOut, Profile, EntityN, pages, homeCommands };