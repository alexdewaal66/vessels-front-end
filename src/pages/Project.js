import { Link } from 'react-router-dom';
import { pages } from './index';
import { languageSelector } from '../helpers';
import React from 'react';
import { Page } from './Page';

const messages = {
    NL: {
        back: 'Terug naar de ',
        home: 'Startpagina',
        requirements:
            <>
                Eisen die Novi Hogeschool stelt aan het frontend gedeelte van de eindopdracht behorend bij de Bootcamp
                Fullstack Developer:
                <ul>
                    <li>
                        Gebruikers kunnen een account aanmaken en daarmee inloggen. Een gedeelte van de content is
                        alleen te
                        bezoeken voor geregistreerde gebruikers (zoals bijvoorbeeld een profielpagina);
                    </li>
                    <li>
                        De applicatie kan bestanden zoals afbeeldingen, pdf-bestanden of muziek-bestanden verwerken en
                        opslaan;
                    </li>
                    <li>
                        Alleen React met JavaScript wordt geaccepteerd als programmeertaal (geen
                        TypeScript);
                    </li>
                    <li>
                        Er wordt gebruik gemaakt van React Context;
                    </li>
                    <li>
                        Je schrijft jouw styling zelf en maakt géén gebruik van out-of-the-box styling systemen zoals
                        Bootstrap, Material-UI of Tailwind;
                    </li>
                    <li>
                        Je maakt gebruik van NPM.
                    </li>
                </ul>
            </>
    },
    EN: {
        back: 'Back to the ',
        home: 'Homepage',
        requirements:
            <>
                Requirements by Novi Hogeschool on the front end part of the final assignment of the Bootcamp Fullstack
                Developer:
                <ul>
                    <li>
                        User can create an account and use it to sign in. Some of the content is only accessible for
                        registered users (for example a profile page);
                    </li>
                    <li>
                        The application can process and store files like images, pdf filles or music files;
                    </li>
                    <li>
                        Only React with JavaScript will be accepted as programming language (no TypeScript);
                    </li>
                    <li>
                        React Context will be utilized;
                    </li>
                    <li>
                        Write your own styling and do not use out-of-the-box styling systems like
                        Bootstrap, Material-UI or Tailwind;
                    </li>
                    <li>
                        You will use NPM.
                    </li>
                </ul>
            </>
    }
};

export default function Project() {

    const TXT = messages[languageSelector()];

    return (
        <Page>
            {TXT.requirements}
            <p>{TXT.back}<Link to={pages.home.path}>{TXT.home}</Link>.</p>
        </Page>
    );
}
