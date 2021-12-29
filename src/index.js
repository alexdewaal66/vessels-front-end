import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import { StatusContextProvider } from './contexts/StatusContext';
import { StorageContextProvider } from './contexts/StorageContext';
import { TestMountDismountContext, TestMountDismountContextProvider } from './dev/TestMountDismountContext';
import { initializeEntitiesMetadata } from './helpers';
import { ObserverContext, ObserverContextProvider } from './contexts/ObserverContext';

initializeEntitiesMetadata();

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <StatusContextProvider>
                {/*<ObserverContextProvider>*/}
                    <StorageContextProvider>
                        <AuthContextProvider>
                            <App/>
                        </AuthContextProvider>
                    </StorageContextProvider>
                {/*</ObserverContextProvider>*/}
            </StatusContextProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// When you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
