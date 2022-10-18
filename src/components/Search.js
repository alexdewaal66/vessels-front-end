import React from 'react';
import { languageSelector } from '../helpers';

const messages = {
    NL: {
        search: 'Zoeken',
    },
    EN: {
        search: 'Search',
    }
};

export function Search({self}) {

    const TXT = messages[languageSelector()];

    return (
        <>
            <p>{TXT.search}</p>
            <p>{self.name}</p>
            <p>{self.path}</p>
        </>
    );
}
