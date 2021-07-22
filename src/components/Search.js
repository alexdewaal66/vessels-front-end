import React from 'react';

export function Search({self}) {

    return (
        <>
            <p>Zoeken</p>
            <p>{self.name}</p>
            <p>{self.path}</p>
        </>
    );
}
