import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import Entity from './Entity';

const pages = {Home: '/', Profile: '/profile', SignIn: '/signin', SignUp: '/signup'};

const pageObjects = {
    homePage: {name: 'Home', path: '/', component: Home, exact: true},
    profilePage: {name: 'Profiel', path: '/profile', component: Profile},
    signUpPage: {name: 'Registreren', path: '/signup', component: SignUp},
    signInPage: {name: 'Inloggen', path: '/signin', component: SignIn},
    entityPage: {name: 'Entiteit', path: '/entity', component: Entity},
};
pageObjects.pageOrder= [
    pageObjects.homePage,
    pageObjects.entityPage,
    pageObjects.signUpPage,
    pageObjects.signInPage,
    pageObjects.profilePage,
];


export { Home, SignUp, SignIn, Profile, Entity, pages, pageObjects };