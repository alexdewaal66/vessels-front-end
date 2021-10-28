import React, { useState} from 'react';
import { Main, Command, Aside, Content } from '../pageLayouts';
import { homeCommands } from './homeCommands';

export default function Home() {
    const [choice, setChoice] = useState(homeCommands.vessel);

    return (
        <Content>
            <Command commandList={homeCommands.displayOrder} choice={choice} setChoice={setChoice}>
            </Command>
            <Main>
                <choice.component self={choice} />
            </Main>
            <Aside>
                ASIDE
            </Aside>
        </Content>
    );
}

