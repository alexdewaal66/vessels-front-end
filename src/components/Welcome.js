import React, { useContext } from 'react';
// import { pageLayout } from '../pageLayouts';
import { AuthContext } from '../contexts/AuthContext';
import { language } from '../helpers';

const messages = {
    NL: {
        menu: 'Hier links vind je het menu met vnl. de gegevenssoorten.',
        options: 'Aan de onderkant wat opties die de interne werking meer inzichtelijk maken, inloggegevens en links naar GitHub.',
        status: 'Helemaal rechts onderin is de status te zien van de laatste gegevensaanvraag.',
    },
    EN: {
        menu: 'On the left you find the menu with mostly data types.',
        options: 'At the bottom some options clarifying the inner workings, user credentials and links to GitHub.',
        status: 'At the bottom right there\'s the status of the latest data request',
    }
};

export function Welcome() {
    const {user} = useContext(AuthContext);

    const TXT = messages[language()];

    return (
        <>
            <p> Welkom,&nbsp;
                {!!user ? (
                    <>
                        {user.username}
                    </>
                ) : (
                    <>
                        gast
                    </>
                )}.
            </p>
            <p>
                {TXT.menu}
            </p>
            <p>
                {TXT.options}
            </p>
            <p>
                {TXT.status}
            </p>
        </>
    );
}