import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import './assets/fonts/stylesheet.css'
import './App.css';
import { pageLayout } from './pageLayouts';
import { pages, Project } from './pages';
import { Footer, Header } from './pageLayouts';
import { domain, useMountEffect } from './helpers';

//TODO README.md
function App() {
    const [, setX] = useState(0);

    function forceUpdate() {
        setX(x => ++x & 255);
    }

    useMountEffect(() => {
        window.document.title = 'Vessels @ ' + domain;
    });

    return (
        <div className={"App " + pageLayout.app}>
            <Header/>
            <Switch>
                <Route exact={true} path="/project" key="/project">
                    <Project/>
                </Route>
                {pages.displayOrder.map(page =>
                    <Route exact={page.exact}
                           path={page.path}
                           key={page.path}
                    >
                        <page.component/>
                    </Route>
                )}
            </Switch>
            <Footer forceUpdate={forceUpdate}/>
        </div>
    );
}

export default App;
