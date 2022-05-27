import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import SignOut from './SignOut';
import { hints } from '../helpers';

const pages = {
    home: {name: 'Home', path: '/', component: Home, exact: true, isVisible: () => true, },
    profile: {name: 'Profiel', path: '/profile', component: Profile, isVisible: user => !!user, },
    signUp: {name: 'Registreren', path: '/signup', component: SignUp, isVisible: user => !user, },
    signIn: {name: 'Inloggen', path: '/signin', component: SignIn, isVisible: user => !user, hints: ['wachtwoorden beschikbaar']},
    signOut: {name: 'Uitloggen', path: '/signout', component: SignOut, isVisible: user => !!user, },
};

pages.displayOrder = [
    pages.home,
    pages.signUp,
    pages.signIn,
    pages.signOut,
    pages.profile,
];



export { Home, SignUp, SignIn, SignOut, Profile, pages};