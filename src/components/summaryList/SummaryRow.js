import React from 'react';

export function SummaryRow({item, metadata, setDetails, elKey}) {
    function choose() {
        setDetails(item);
    }

    return (
        <tr onClick={choose}
            key={elKey}
        >
            <td key={elKey + 'id'}
            >
                {item.id}
            </td>
            {metadata.summary.map(propertyName =>
                <td key={elKey + propertyName}
                >
                    {item[propertyName]}
                </td>
            )}
        </tr>
    );
}

