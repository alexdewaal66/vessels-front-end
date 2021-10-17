import React from 'react';

export function SummaryHeading({metadata, elKey}) {
    // console.log(`metadata=`, metadata, `elKey=`, elKey);

    return (
        <>
            <tr>
                {metadata.summary.map(propertyName =>
                    <th key={elKey + propertyName + '_h'}>
                        {metadata.properties[propertyName].label || propertyName}
                    </th>
                )}
            </tr>
        </>
    );
}

