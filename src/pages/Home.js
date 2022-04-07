import React, { useContext } from 'react';
import { Main, Menu, Aside, Content } from '../pageLayouts';
import { homeMenuItems } from './homeMenuItems';
import { ChoiceContext } from '../contexts';
import { Welcome } from '../components';
import { Stringify } from '../dev';
import { StorageContext } from '../contexts';

export default function Home() {
    const {choice, makeChoice} = useContext(ChoiceContext);
    const {store} = useContext(StorageContext);
    console.log('choice = ',choice);
    const ChosenComponent = choice.component || Welcome;

    return (
        <Content>
            <Menu menuItems={homeMenuItems.displayOrder} choice={choice} makeChoice={makeChoice}>
            </Menu>
            <Main>
                {/*{(logv('-----HOME-----', {choice_label: choice.label}), '')}*/}
                <ChosenComponent/>
            </Main>
            <Aside>
            </Aside>
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