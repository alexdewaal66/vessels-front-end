import React from 'react';
import { makeMenu } from './makeMenu';
import { Welcome } from '../components/Welcome';
import { Page } from './Page';
import { entityTypes } from '../helpers/globals/entityTypes';
import { PageRoutes } from './PageRoutes';

const dev = true;
// const separator = true;
const isDefault = true;

export const usersMenu = makeMenu('users', [
    {name: 'welcome', label: {NL: 'Welkom', EN: 'Welcome'}, Component: Welcome, isDefault},
    {entityType: entityTypes.user},
    {entityType: entityTypes.user, id: 2, dev},
    {entityType: entityTypes.role},
    // {separator, dev},
]);

export function Users() {

    return (
        <Page menuItems={usersMenu}>
            <PageRoutes menuItems={usersMenu}/>
        </Page>
    );
}
