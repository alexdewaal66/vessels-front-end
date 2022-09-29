import React from 'react';
import { language } from '../helpers';

const messages = {
    NL: {
        patience: 'Even geduld a.u.b.',
    },
    EN: {
        patience: 'Patience please',
    }
};

export function Patience({children}) {

    const TXT = messages[language()];

    return (
        <span style={{color: "darkred"}}>{TXT.patience}{children}</span>
    );
}
