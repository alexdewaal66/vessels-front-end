import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import './assets/fonts/stylesheet.css'
import './App.css';
import { pageLayout } from './pageLayouts';
import { appNamePage, pages } from './pages/pages';
import { Footer, Header } from './pageLayouts';
import { domain, languageSelector } from './helpers';
import { AuthContext } from './contexts';

const allPages = pages.displayOrder.concat(appNamePage);

//TODO README.md
function App() {
    const [, setX] = useState(0);
    const authorization = useContext(AuthContext);
    // const userAuthorities = useMemo(() => authorization.getRoles(), [authorization]);

    function forceUpdate() {
        setX(x => ++x & 255);
    }

    const person = authorization?.user?.username || {NL: 'gast', EN: 'guest'}[languageSelector()];

    useEffect(() => {
        window.document.title = `Vessels @ ${domain} -- ${person}`;
    }, [person]);

    return (
        <>
            <div className={"App " + pageLayout.app}>
                <Header/>
                <Routes>
                    {allPages.map(({path, Component, menu, isDefault}) => {
                        return (
                            <Fragment key={path + '-fragment'}>
                                <Route path={path + (menu ? '/*' : '')} element={<Component/>} key={path}/>
                                {isDefault &&
                                    <Route path="*" element={<Navigate to={path} replace />} key={path + '-default'}/>}
                            </Fragment>
                        )
                    })}
                </Routes>
                <Footer forceUpdate={forceUpdate}/>
            </div>
        </>
    );
}

export default App;
