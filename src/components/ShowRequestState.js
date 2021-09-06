import React from 'react';
import { Statusbar } from '../pageLayouts/Statusbar';

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export function ShowRequestState({requestState, description = 'de opdracht', advice}) {
    return (
        <>
            {requestState.isPending && (
                <Statusbar>
                    Even geduld a.u.b.,
                    {capitalize(description)}
                    wordt uitgevoerd.
                </Statusbar>
            )}
            {requestState.isError && (
                <Statusbar>Er is iets fout gegaan met {description}.
                    {advice}
                    ({requestState.errorMsg})</Statusbar>
            )}
            {requestState.isSuccess && (
                <Statusbar>{capitalize(description)} is uitgevoerd.</Statusbar>
            )}
        </>
    );
}
