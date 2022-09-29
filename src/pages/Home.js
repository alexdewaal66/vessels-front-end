import React, { useContext } from 'react';
import { Main, Menu, Content } from '../pageLayouts';
import { homeMenuItems } from './homeMenuItems';
import { ChoiceContext } from '../contexts';
import { Welcome } from '../components';
import { useMountEffect } from '../helpers';
import { ShowStore } from '../dev/ShowStore';

export default function Home() {
    const {choice, makeChoice, initChoice} = useContext(ChoiceContext);
    const ChosenComponent = choice.component || Welcome;


    useMountEffect(initChoice(homeMenuItems.default));

    return (
        <Content>
            <Menu menuItems={homeMenuItems.displayOrder} choice={choice} makeChoice={makeChoice}>
            </Menu>
            <Main>
                {/*{(logv('-----HOME-----', {choice_label: choice.label}), '')}*/}
                <ChosenComponent/>
            </Main>
            <ShowStore/>
        </Content>
    );
}

/*
                <Stringify data={entityTypes}>entityTypes</Stringify>
                <Stringify data={store.timestamps.state}>timestamps</Stringify>
                <Stringify data={store.user.state}>users</Stringify>
 */