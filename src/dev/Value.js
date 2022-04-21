import React from 'react';

export function Value(props) {

    return (
        <>
            {Object.entries(props).map( ([key, value]) =>
                <>
                    &nbsp;{key}: {'' + value}<br/>
                </>
            ) }
        </>
    );
}