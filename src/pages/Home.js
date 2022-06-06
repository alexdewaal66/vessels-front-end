import React, { useContext, useState } from 'react';
import { Main, Menu, Content, Aside } from '../pageLayouts';
import { homeMenuItems } from './homeMenuItems';
import { ChoiceContext } from '../contexts';
import { Welcome } from '../components';
import { useMountEffect } from '../helpers';
import { Stringify } from '../dev/Stringify';
import { StorageContext } from '../contexts';
import { config } from '../helpers';

export default function Home() {
    const {choice, makeChoice, initChoice} = useContext(ChoiceContext);
    const {store} = useContext(StorageContext);
    // console.log('choice = ',choice);
    const ChosenComponent = choice.component || Welcome;

    const storeKeyFlags = Object.fromEntries(Object.keys(store).map(key => [key, false]));
    const [selectedKeys, setSelectedKeys] = useState(storeKeyFlags);
    const changeHandler = (e) => {
        const changedKey = e.target.value;
        setSelectedKeys(current => ({...current, [changedKey]: !current[changedKey]}))
    }

    useMountEffect(initChoice(homeMenuItems.default));

    return (
        <Content>
            <Menu menuItems={homeMenuItems.displayOrder} choice={choice} makeChoice={makeChoice}>
            </Menu>
            <Main>
                {/*{(logv('-----HOME-----', {choice_label: choice.label}), '')}*/}
                <ChosenComponent/>
            </Main>
            {config.showStore.value &&
                <Aside>
                    <select onChange={changeHandler}>
                        <option value="" disabled selected>Select your option</option>
                        {Object.keys(store).map(
                            key =>
                                <option value={key} key={key}>{key}</option>
                        )}
                    </select>
                    {Object.entries(selectedKeys).map(
                        ([key, flag]) =>
                            (flag
                                    ? <Stringify data={store[key].state} key={key}>{key}</Stringify>
                                    : null
                            )
                    )}
                </Aside>
            }
        </Content>
    );
}

/*
                <Stringify data={entityTypes}>entityTypes</Stringify>
                <Stringify data={store.timestamps.state}>timestamps</Stringify>
                <Stringify data={store.user.state}>users</Stringify>
 */