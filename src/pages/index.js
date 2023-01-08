import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import SignOut from './SignOut';
import Project from './Project';
import { Users } from './Users';
import { authorities } from '../helpers/globals/levels';
import { Account } from './Account';

const pages = {
    home: {
        label: {NL: 'Scheepvaart', EN: 'Shipping'},
        path: '/shipping', component: Home, exact: true, isVisible: () => true,
    },
    users: {
        label: {NL: 'Gebruikers', EN: 'Users'},
        path: '/users', component: Users, exact: true, isVisible: () => true,
        access: authorities.USER,
    },
    profile: {
        label: {NL: 'Profiel', EN: 'Profile'},
        path: '/profile', component: Profile, isVisible: user => !!user,
    },
    account: {
        label: 'Account',
        path: '/account', component: Account, isVisible: user => !!user,
    },
    signUp: {
        label: {NL: 'Registreren', EN: 'Register'},
        path: '/signup', component: SignUp, isVisible: user => !user,
    },
    signIn: {
        label: {NL: 'Inloggen', EN: 'Log in'},
        path: '/signin',
        component: SignIn,
        isVisible: user => !user,
        hints: {NL: ['wachtwoorden beschikbaar'], EN: ['passwords available']}
    },
    signOut: {
        label: {NL: 'Uitloggen', EN: 'Log out'},
        path: '/signout',
        component: SignOut,
        isVisible: user => !!user,
    },
};

pages.displayOrder = [
    pages.home,
    pages.users,
    pages.signUp,
    pages.signIn,
    // pages.signOut,
    pages.account,
    // pages.profile,
];


export {Project, Home, SignUp, SignIn, SignOut, Profile, pages };