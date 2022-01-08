import React, { useState, useContext } from 'react';
import { Main, Menu, Aside, Content } from '../pageLayouts';
import { homeMenuItems } from './homeMenuItems';
import { ChoiceContext } from '../contexts/ChoiceContext';
import { logv } from '../dev/log';

export default function Home() {
    const {choice, makeChoice} = useContext(ChoiceContext);

    return (
            <Content>
                <Menu menuItems={homeMenuItems.displayOrder} choice={choice} makeChoice={makeChoice}>
                </Menu>
                <Main>
                    {/*{(logv('-----HOME-----', {choice_label: choice.label}), '')}*/}
                    <choice.component/>
                </Main>
                <Aside>
                    ASIDE
                </Aside>
            </Content>
    );
}

