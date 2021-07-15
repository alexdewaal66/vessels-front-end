import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

import './assets/fonts/stylesheet.css'
import './App.css';
import layout from './layouts/layout.module.css';
import Header from './components/Header';
import { Home, SignUp, SignIn, Profile, Entity, pages, pageObjects } from './pages';

function App() {
    return (
        <Router>
            <div className={"App " + layout.app}>
                <Header/>
                <Switch>
                    {/*<Route exact path={pages.Home}>*/}
                    <Route exact={pageObjects.homePage.exact} path={pageObjects.homePage.path}>
                        <Home/>
                    </Route>
                    <Route path={pages.SignUp}>
                        <SignUp/>
                    </Route>
                    <Route path={pages.SignIn}>
                        <SignIn/>
                    </Route>
                    <Route path={pages.Profile}>
                        <Profile/>
                    </Route>
                </Switch>
                <footer className={layout.footer}>FOOTER</footer>
            </div>
        </Router>
    );
}

export default App;
