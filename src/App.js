import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import './assets/fonts/stylesheet.css'
import './App.css';
import { pageLayout } from './pageLayouts';
import { pages } from './pages';
import { Footer, Header } from './pageLayouts';

//TODO README.md
function App() {
    const [trigger, setTrigger] = useState(false);

    return (
            <div className={"App " + pageLayout.app}>
                <Header/>
                <Switch>
                    {pages.displayOrder.map( page =>
                        <Route exact={page.exact}
                               path={page.path}
                               key={page.path}
                        >
                            <page.component />
                        </Route>
                    )}
                </Switch>
                <Footer setTrigger={setTrigger}/>
            </div>
    );
}

export default App;
