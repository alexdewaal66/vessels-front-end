import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { languageSelector } from '../helpers';

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

export function SignOutComp() {
    // const logRoot = rootMkr(SignOut2);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const {logout} = authContext;

    // logv(logRoot, {authContext});


    function onSubmit() {
        logout();
        navigate('/');
    }

    const TXT = messages[languageSelector()];

    return (
        <>
            {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
            <form onSubmit={onSubmit} style={{margin: '2em'}}>
                <button
                    type="submit"
                    className="form-button"
                >
                    {TXT.signOutCmd}
                </button>
            </form>
        </>
    );
}
