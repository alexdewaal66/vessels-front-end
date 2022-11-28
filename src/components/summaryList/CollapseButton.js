import { summaryStyle } from './index';
import { hints, languageSelector } from '../../helpers';
import React from 'react';

const messages = {
    NL: {
        toggle: 'inklappen/uitklappen',
    },
    EN: {
        toggle: 'collapse/expand',
    }
};

export function CollapseButton({small, toggleCollapsed}) {

    const TXT = messages[languageSelector()];

    return small ? (
        <button type={'button'}
                onClick={toggleCollapsed}
                className={summaryStyle.sort}
                title={hints(TXT.toggle)}
        >
            ≣
        </button>
    ) : null
}
