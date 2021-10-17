import React from 'react';

export function SummaryHeading({metadata, elKey}) {
    // console.log(`metadata=`, metadata, `elKey=`, elKey);

    function label(object, propertyName) {
        const parts = propertyName.split('.');
        return object[parts[0]].label;
    }

    return (
        <>
            <tr>
                {metadata.summary.map(propertyName =>
                    <th key={elKey + propertyName + '_h'}>
                        {/*{metadata.properties[propertyName].label || propertyName}*/}
                        {label(metadata.properties, propertyName) || propertyName}
                    </th>
                )}
            </tr>
        </>
    );
}

