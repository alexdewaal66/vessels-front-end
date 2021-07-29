import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import Entity from './Entity';
import SignOut from './SignOut';
import { Search } from '../components/Search';
import { Vessel } from '../components/Vessel';
import { Empty } from '../dev/Empty';
import { Colors } from '../dev/Colors';
import { Xyzs } from '../components/Xyzs';

const pages = {
    home: {name: 'Home', path: '/', component: Home, exact: true, isVisible: () => true, },
    profile: {name: 'Profiel', path: '/profile', component: Profile, isVisible: user => !!user, },
    signUp: {name: 'Registreren', path: '/signup', component: SignUp, isVisible: user => !user, },
    signIn: {name: 'Inloggen', path: '/signin', component: SignIn, isVisible: user => !user, },
    signOut: {name: 'Uitloggen', path: '/signout', component: SignOut, isVisible: user => !!user, },
    entity: {name: 'Entiteit', path: '/entity', component: Entity, isVisible: user => !!user, },
};

pages.displayOrder = [
    pages.home,
    pages.entity,
    pages.signUp,
    pages.signIn,
    pages.signOut,
    pages.profile,
];

const homeCommands = {
    empty: {name: 'leeg', component: Empty},
    search: {name: 'Zoek', component: Search,},
    vessels: {name: 'Vaartuigen', component: Vessel,},
    xyzs: {name: 'Xyzs', component: Xyzs},
    // xyz1: {name: 'Xyz 1', component: Xyzs({id: 1})},
    users: {name: 'Gebruikers', component: Empty,},
    colors: {name: 'Kleuren', component: Colors,},
};

homeCommands.displayOrder = [
    homeCommands.search,
    homeCommands.vessels,
    homeCommands.users,
    homeCommands.xyzs,
    homeCommands.colors,
];



export { Home, SignUp, SignIn, SignOut, Profile, Entity, pages, homeCommands };