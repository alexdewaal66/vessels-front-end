import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './assets/fonts/stylesheet.css'
import './App.css';
import layout from './pageLayouts/pageLayout.module.css';
import Header from './pageLayouts/Header';
import { pages, Home, Entity, SignOut, Profile, SignIn, SignUp } from './pages';
import { Footer } from './pageLayouts/Footer';

function App() {
    return (
            <div className={"App " + layout.app}>
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
                <Footer>FOOTER</Footer>
            </div>
    );
}

export default App;
