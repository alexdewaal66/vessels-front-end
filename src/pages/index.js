import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import Entity from './Entity';

const pageObjects = {
    home: {name: 'home', path: '/', component: Home, exact: true},
    profile: {name: 'Profiel', path: '/profile', component: Profile},
    signUp: {name: 'Registreren', path: '/signup', component: SignUp},
    signIn: {name: 'Inloggen', path: '/signin', component: SignIn},
    entity: {name: 'Entiteit', path: '/entity', component: Entity},
};

pageObjects.pageOrder= [
    pageObjects.home,
    pageObjects.entity,
    pageObjects.signUp,
    pageObjects.signIn,
    pageObjects.profile,
];


export { Home, SignUp, SignIn, Profile, Entity, pageObjects };