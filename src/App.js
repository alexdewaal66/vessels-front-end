import React from 'react';
import { Switch, Route, } from 'react-router-dom';

import './assets/fonts/stylesheet.css'
import './App.css';
import layout from './pageLayouts/layout.module.css';
import Header from './components/Header';
import { pages, SignOut } from './pages';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Entity from './pages/Entity';

function App() {
    return (
            <div className={"App " + layout.app}>
                <Header/>
                <Switch>
                    <Route exact={pages.home.exact}
                           path={pages.home.path}>
                        <Home/>
                    </Route>
                    <Route path={pages.signUp.path}>
                        <SignUp/>
                    </Route>
                    <Route path={pages.signIn.path}>
                        <SignIn/>
                    </Route>
                    <Route path={pages.signOut.path}>
                        <SignOut/>
                    </Route>
                    <Route path={pages.profile.path}>
                        <Profile/>
                    </Route>
                    <Route path={pages.entity.path}>
                        <Entity/>
                    </Route>
                </Switch>
                <footer className={layout.footer}>FOOTER</footer>
            </div>
    );
}

export default App;
