import { Shipping, shippingMenu } from './Shipping';
import { SignUp } from './SignUp';
import { SignIn } from './SignIn';
import { Project } from './Project';
import { Users, usersMenu } from './Users';
import { authorities } from '../helpers/globals/levels';
import { Account, accountMenu } from './Account';

export const appNamePage = {
    label: 'Vessels',
    path: '/project', Component: Project,
    isVisible: () => true,
    hints: {
        NL: 'Eisen aan Frontend Eindopdracht',
        EN: 'Requirements on Final Assignment',
    },
}

const isDefault = true;

export const pages = {
    shipping: {
        isDefault,
        label: {NL: 'Scheepvaart', EN: 'Shipping'},
        path: '/shipping', Component: Shipping,
        isVisible: () => true,
        menu: shippingMenu,
    },
    users: {
        label: {NL: 'Gebruikers', EN: 'Users'},
        path: '/users', Component: Users,
        // exact: true,
        isVisible: () => true,
        access: authorities.USER,
        menu: usersMenu,
    },
    account: {
        label: 'Account',
        path: '/account', Component: Account,
        isVisible: user => !!user,
        menu: accountMenu,
    },
    signUp: {
        label: {NL: 'Registreren', EN: 'Register'},
        path: '/signup', Component: SignUp,
        isVisible: user => !user,
    },
    signIn: {
        label: {NL: 'Inloggen', EN: 'Log in'},
        path: '/signin',
        Component: SignIn,
        isVisible: user => !user,
        hints: {NL: ['wachtwoorden beschikbaar'], EN: ['passwords available']}
    },
};

pages.displayOrder = [
    pages.shipping,
    pages.users,
    pages.signUp,
    pages.signIn,
    pages.account,
];


