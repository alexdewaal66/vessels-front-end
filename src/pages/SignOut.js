import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { pages } from './index';
import { languageSelector } from '../helpers';
import { Page } from './Page';

const messages = {
    NL: {
        signOut: 'Uitloggen',
        signOutCmd: 'Log uit',
    },
    EN: {
        signOut: 'Log out',
        signOutCmd: 'Log out',
    },
};

export default function SignOut() {
    // const logRoot = rootMkr(SignOut);
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const {logout} = authContext;

    // logv(logRoot, {authContext});


    function onSubmit() {
        logout();
        history.push(pages.home.path);
    }

    const TXT = messages[languageSelector()];

    return (
        <Page>
            <h1>{TXT.signOut}</h1>
            {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
            <form onSubmit={onSubmit}>
                <button
                    type="submit"
                    className="form-button"
                >
                    {TXT.signOutCmd}
                </button>
            </form>
        </Page>
    );
}
