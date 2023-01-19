import React from 'react';
import { ProfileComp } from './ProfileComp';
import { SignOutComp } from './SignOutComp';
import { Page } from './Page';
import { makeMenu } from './makeMenu';
import { PageRoutes } from './PageRoutes';

// const dev = true;
// const separator = true;
const isDefault = true;

export const accountMenu = makeMenu('account', [
    {name: 'profile', label: {NL: 'Profiel', EN: 'Profile'}, Component: ProfileComp, isDefault},
    // {label: {NL: 'Voorkeuren', EN: 'Preferences'}, component: Preferences}, // someday...
    // {separator},
    {name: 'sign-out', label: {NL: 'Log uit', EN: 'Log out'}, Component: SignOutComp},
    // {separator, dev},
]);

export function Account() {

    return (
        <Page menuItems={accountMenu}>
            <PageRoutes menuItems={accountMenu}/>
        </Page>
    );
}

