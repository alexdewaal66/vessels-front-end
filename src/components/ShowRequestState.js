import React from 'react';
import { ShowStatus } from '../pageLayouts/ShowStatus';
import { Statusbar } from '../pageLayouts/Statusbar';

export function ShowRequestState({requestState, description, advice}) {
    return (
        <>
            {requestState.isPending && (
                <Statusbar>
                    Even geduld a.u.b.,
                    {/*{description ? description : 'Opdracht '}*/}
                    wordt uitgevoerd.
                </Statusbar>
            )}
            {requestState.isError && (
                <Statusbar>Er is iets fout gegaan.
                    {advice}
                    ({requestState.errorMsg})</Statusbar>
            )}
            {requestState.isSuccess && (
                <Statusbar>De opdracht is uitgevoerd.</Statusbar>
            )}
        </>
    );
}
