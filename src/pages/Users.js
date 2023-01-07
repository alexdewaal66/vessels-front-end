import React, { useContext } from 'react';
import { makeEntityMenuItem } from './makeMenuItems';
import { ChoiceContext } from '../contexts';
import { Welcome } from '../components';
import { useMountEffect } from '../helpers';
import { Page } from './Page';
import { entityTypes } from '../helpers/globals/entityTypes';

const dev = true;
// const separator = true;

const menuItems = [
    {label: {NL: 'Welkom', EN: 'Welcome'}, component: Welcome},
    {...makeEntityMenuItem(entityTypes.user)},
    {...makeEntityMenuItem(entityTypes.user, 2), dev},
    {...makeEntityMenuItem(entityTypes.role)},
    // {label: 'sep1', separator, dev},
    // {label: 'sep2', separator, dev},
];

export function Users() {
    const {choice, makeChoice, initChoice} = useContext(ChoiceContext);
    const ChosenComponent = choice.component || Welcome;


    useMountEffect(initChoice(menuItems[0]));

    return (
        <Page menuItems={menuItems} choice={choice} makeChoice={makeChoice}>
            <ChosenComponent/>
        </Page>
    );
}
