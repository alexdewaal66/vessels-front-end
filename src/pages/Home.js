import React, { useState} from 'react';
import { Main, Command, Aside, Content } from '../pageLayouts';
import { homeCommands } from './homeCommands';
import { logv } from '../dev/log';

export default function Home() {
    const [choice, setChoice] = useState(homeCommands.default);

    return (
        <Content>
            <Command commandList={homeCommands.displayOrder} choice={choice} setChoice={setChoice}>
            </Command>
            <Main>
                {(logv('-----HOME-----', {'choice.label': choice.label}), '')}
                <choice.component />
            </Main>
            <Aside>
                ASIDE
            </Aside>
        </Content>
    );
}

