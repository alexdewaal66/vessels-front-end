import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';
import SignOut from './SignOut';

const pages = {
    home: {label: 'Home', path: '/', component: Home, exact: true, isVisible: () => true, },
    profile: {label: {NL:'Profiel', EN:'Profile'}, path: '/profile', component: Profile, isVisible: user => !!user, },
    signUp: {label: {NL: 'Registreren', EN: 'Register'}, path: '/signup', component: SignUp, isVisible: user => !user, },
    signIn: {label: {NL: 'Inloggen', EN: 'Log in'}, path: '/signin', component: SignIn, isVisible: user => !user, hints: ['wachtwoorden beschikbaar']},
    signOut: {label: {NL: 'Uitloggen', EN: 'Log out'}, path: '/signout', component: SignOut, isVisible: user => !!user, },
};

pages.displayOrder = [
    pages.home,
    pages.signUp,
    pages.signIn,
    pages.signOut,
    pages.profile,
];



export { Home, SignUp, SignIn, SignOut, Profile, pages};