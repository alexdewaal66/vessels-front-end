import React, { useContext } from 'react';
import { Main, Menu, Content, Aside } from '../pageLayouts';
import { homeMenuItems } from './homeMenuItems';
import { ChoiceContext } from '../contexts';
import { Welcome } from '../components';
import { useMountEffect } from '../helpers';
import { Stringify } from '../dev/Stringify';
import { entityTypes } from '../helpers';
// import { StorageContext } from '../contexts';

export default function Home() {
    const {choice, makeChoice, initChoice} = useContext(ChoiceContext);
    // const {store} = useContext(StorageContext);
    // console.log('choice = ',choice);
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
            {/*<Aside>*/}
            {/*    <Stringify data={entityTypes}>entityTypes</Stringify>*/}
            {/*</Aside>*/}
        </Content>
    );
}

/*

                {Object.entries(store).map(([key, value]) =>
                    <Stringify data={value.state}>{key}</Stringify>
                    )
                }
                <Stringify data={store.timestamps.state}>timestamps</Stringify>
                <Stringify data={store.user.state}>users</Stringify>

 */