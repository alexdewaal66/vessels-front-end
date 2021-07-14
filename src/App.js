import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

import './assets/fonts/stylesheet.css'
import './App.css';
import layout from './layouts/layout.module.css';
import { Colors } from './dev/Colors';
import Header from './components/Header';
import { pages } from './pages';
import { Home } from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';

function App() {
    return (
        <Router>
            <div className={"App " + layout.app}>
                <Header />
                <Switch>
                    <Route exact path={pages.Home}>
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
