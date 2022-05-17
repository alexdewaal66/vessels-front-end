import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { StatusContextProvider } from './contexts/StatusContext';
import { StorageContextProvider } from './contexts/StorageContext';
import { AuthContextProvider } from './contexts/AuthContext';
import { ChoiceContextProvider } from './contexts/ChoiceContext';
import { entityTypes, initializeEntityTypes } from './helpers';

initializeEntityTypes(entityTypes);

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <StatusContextProvider>
                <StorageContextProvider>
                    <AuthContextProvider>
                        <ChoiceContextProvider>
                            <App/>
                        </ChoiceContextProvider>
                    </AuthContextProvider>
                </StorageContextProvider>
            </StatusContextProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// When you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
