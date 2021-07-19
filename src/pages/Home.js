import React from 'react';
import layout from '../pageLayouts/layout.module.css';
import { Colors } from '../dev/Colors';
import { Main, Command, Aside, Content } from '../pageLayouts';

export default function Home() {
    return (
        <Content>
            <Main>
                <Colors/>
            </Main>
            <Command>
                COMMAND
            </Command>
            <Aside>
                ASIDE
            </Aside>
        </Content>
    );
}