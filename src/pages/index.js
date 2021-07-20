import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import Entity from './Entity';
import SignOut from './SignOut';

const pages = {
    home: {name: 'home', path: '/', component: Home, exact: true},
    profile: {name: 'Profiel', path: '/profile', component: Profile},
    signUp: {name: 'Registreren', path: '/signup', component: SignUp},
    signIn: {name: 'Inloggen', path: '/signin', component: SignIn},
    signOut: {name: 'Uitloggen', path: '/signout', component: SignOut},
    entity: {name: 'Entiteit', path: '/entity', component: Entity},
};

pages.pageOrder= [
    pages.home,
    pages.entity,
    pages.signUp,
    pages.signIn,
    pages.signOut,
    pages.profile,
];


export { Home, SignUp, SignIn, SignOut, Profile, Entity, pages };