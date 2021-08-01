import React, { useEffect, useState } from 'react';
import { Main, Command, Aside, Content } from '../pageLayouts';
import { homeCommands } from './index';
import { useOOState } from '../helpers/customHooks';

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

