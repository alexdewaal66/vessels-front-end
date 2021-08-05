import React from 'react';

export function ShowRequestState({requestState, advice}) {
    return (
        <>
            {requestState.isPending && (
                <>Even geduld a.u.b.</>
            )}
            {requestState.isError && (
                <>Er is iets fout gegaan.
                    {advice}
                    ({requestState.errorMsg})</>
            )}
            {requestState.isSuccess && (
                <>De opdracht is uitgevoerd.</>
            )}
        </>
    );
}
