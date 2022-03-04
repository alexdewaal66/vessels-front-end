import React, { useContext } from 'react';
import { Main, Menu, Aside, Content } from '../pageLayouts';
import { homeMenuItems } from './homeMenuItems';
import { ChoiceContext } from '../contexts/ChoiceContext';
import { Stringify } from '../dev/Stringify';
import { StorageContext } from '../contexts/StorageContext';

export default function Home() {
    const {choice, makeChoice} = useContext(ChoiceContext);
    const {store} = useContext(StorageContext);

    return (
        <Content>
            <Menu menuItems={homeMenuItems.displayOrder} choice={choice} makeChoice={makeChoice}>
            </Menu>
            <Main>
                {/*{(logv('-----HOME-----', {choice_label: choice.label}), '')}*/}
                <choice.component/>
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

 */