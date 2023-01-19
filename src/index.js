import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {
    MessageContextProvider, StorageContextProvider,
    AuthContextProvider, ChoiceContextProvider
} from './contexts';
import { entityTypes, initializeEntityTypes } from './helpers/globals/entityTypes';

initializeEntityTypes(entityTypes);
console.log('\n--------------------------------------\n',{entityTypes},'\n--------------------------------------\n');

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <MessageContextProvider>
                <StorageContextProvider>
                    <AuthContextProvider>
                        <ChoiceContextProvider>
                            <App/>
                        </ChoiceContextProvider>
                    </AuthContextProvider>
                </StorageContextProvider>
            </MessageContextProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// When you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
