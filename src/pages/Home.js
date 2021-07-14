import React from 'react';
import layout from '../layouts/layout.module.css';
import { Colors } from '../dev/Colors';
import { Main, Command, Aside } from '../layouts';

export function Home() {
    return (
        <div className={layout.container}>
            <Main>
                CENTER
                <Colors/>
            </Main>
            <Command>
                COMMAND
            </Command>
            <Aside>
                ASIDE
            </Aside>
        </div>
    );
}