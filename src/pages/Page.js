import { Content, Main, Menu } from '../pageLayouts';
import { ShowStore } from '../dev/ShowStore';
import React from 'react';

export function Page({children, ...rest}) {
    return (
        <Content>
            <Menu {...rest}/>
            <Main>
                {children}
            </Main>
            <ShowStore/>
        </Content>
    );
}
