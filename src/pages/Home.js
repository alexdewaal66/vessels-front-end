import React from 'react';
import { Main, Command, Aside, Content } from '../pageLayouts';
import { useOOState } from '../helpers/customHooks';
import { homeCommands } from './homeCommands';

export default function Home() {
    const choice = useOOState(homeCommands.empty);

    return (
        <Content>
            <Command commandList={homeCommands} choice={choice}>
            </Command>
            <Main>
                <choice.value.component self={choice.value} />
            </Main>
            <Aside>
                ASIDE
            </Aside>
        </Content>
    );
}

