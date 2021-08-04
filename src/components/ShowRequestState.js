import React from 'react';

export function ShowRequestState({requestState}) {
    return (
        <>
            {requestState.isPending && (
                <>Even geduld a.u.b.</>
            )}
            {requestState.isError && (
                <>Er is iets fout gegaan ({requestState.errorMsg}).</>
            )}
            {requestState.isSuccess && (
                <>De opdracht is uitgevoerd.</>
            )}
        </>
    );
}
