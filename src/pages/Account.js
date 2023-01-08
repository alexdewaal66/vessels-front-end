import React, { useContext } from 'react';
import { ChoiceContext } from '../contexts';
import { Welcome } from '../components';
import { useMountEffect } from '../helpers';
import { Page } from './Page';
import { ProfileComp } from './ProfileComp';
import { SignOutComp } from './SignOutComp';

// const dev = true;
// const separator = true;

const menuItems = [
    {label: {NL: 'Profiel', EN: 'Profile'}, component: ProfileComp},
    // {label: {NL: 'Voorkeuren', EN: 'Preferences'}, component: Preferences}, // someday...
    // {label: 'sep1', separator},
    {label: {NL: 'Log uit', EN: 'Log out'}, component: SignOutComp},
    // {label: 'sep2', separator, dev},
];

export function Account() {
    const {choice, makeChoice, initChoice} = useContext(ChoiceContext);
    const ChosenComponent = choice.component || Welcome;


    useMountEffect(initChoice(menuItems[0]));

    return (
        <Page menuItems={menuItems} choice={choice} makeChoice={makeChoice}>
            <ChosenComponent/>
        </Page>
    );
}

