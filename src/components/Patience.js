import React from 'react';
import { languageSelector } from '../helpers';

const messages = {
    NL: {
        patience: 'Even geduld a.u.b.',
    },
    EN: {
        patience: 'Patience please',
    }
};

export function Patience({children}) {

    const TXT = messages[languageSelector()];

    return (
        <span style={{color: "darkred"}}>{TXT.patience}{children}</span>
    );
}
