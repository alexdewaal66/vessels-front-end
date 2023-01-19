import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { languageSelector } from '../helpers';

const messages = {
    NL: {
        welcome: 'Welkom',
        guest: 'gast',
        menu: 'Hier links vind je het menu met vooral de gegevenssoorten.',
        footer: 'Aan de onderkant o.a. wat opties voor taal en tooltips en die de interne werking meer inzichtelijk maken, inloggegevens en links naar GitHub.',
        status: 'Helemaal rechts onderin is de status te zien van de laatste gegevensaanvraag.',
    },
    EN: {
        welcome: 'Welcome',
        guest: 'guest',
        menu: 'On the left you find the menu with mostly data types.',
        footer: 'At the bottom some options for language and tooltips etc. and those clarifying the inner workings, user credentials and links to GitHub.',
        status: 'At the bottom right there\'s the status of the latest data request',
    }
};

export function Welcome() {
    const {user} = useContext(AuthContext);

    const TXT = messages[languageSelector()];

    return (
        <>
            <p> {TXT.welcome},&nbsp;
                {!!user ? (
                    <>
                        {user.username}
                    </>
                ) : (
                    <>
                        {TXT.guest}
                    </>
                )}.
            </p>
            <p>
                {TXT.menu}
            </p>
            <p>
                {TXT.footer}
            </p>
            <p>
                {TXT.status}
            </p>
        </>
    );
}