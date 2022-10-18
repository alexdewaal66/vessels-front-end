import React from 'react';
import { Statusbar } from '../pageLayouts/Statusbar';
import { languageSelector } from '../helpers';

const messages = {
    NL: {
        patience: 'Even geduld a.u.b.',
        processing: ' wordt verwerkt.',
        error: 'Er is iets fout gegaan met ',
        executed: ' is geslaagd.',
    },
    EN: {
        patience: 'Patience please',
        processing: ' is being processed.',
        error: 'An error occurred while processing ',
        executed: ' is successful.',
    },
};
const defaultDesc = {NL: 'de opdracht', EN: 'the request'};

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export function ShowRequestState({requestState, description = defaultDesc, advice}) {

    const TXT = messages[languageSelector()];

    return (
        <>
            {requestState?.isPending && (
                <Statusbar>
                    {TXT.patience}&nbsp;
                    {capitalize(description)}
                    {TXT.processing}
                </Statusbar>
            )}
            {requestState?.isError && (
                <Statusbar>{TXT.error}{description}.
                    {advice}
                    ({requestState.errorMsg})
                </Statusbar>
            )}
            {requestState?.isSuccess && (
                <Statusbar>
                    {capitalize(description)}{TXT.executed}
                </Statusbar>
            )}
        </>
    );
}
