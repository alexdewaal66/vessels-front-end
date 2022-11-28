import React, { useContext } from 'react';
import { homeMenuItems } from './homeMenuItems';
import { ChoiceContext } from '../contexts';
import { Welcome } from '../components';
import { useMountEffect } from '../helpers';
import { Page } from './Page';

export default function Home() {
    const {choice, makeChoice, initChoice} = useContext(ChoiceContext);
    const ChosenComponent = choice.component || Welcome;


    useMountEffect(initChoice(homeMenuItems.default));

    return (
        <Page menuItems={homeMenuItems.displayOrder} choice={choice} makeChoice={makeChoice}>
                {/*{(logv('-----HOME-----', {choice_label: choice.label}), '')}*/}
                <ChosenComponent/>
        </Page>
    );
}
