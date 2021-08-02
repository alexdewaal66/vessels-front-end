import React from 'react';
import summaryStyles from './summary.module.css';

export function SummaryRow({item, metadata, setDetails, elKey}) {
    function choose() {
        setDetails(item);
    }

    return (
        <tr onClick={choose}
            className={summaryStyles.row}
            key={elKey}
        >
            {metadata.summary.map(propertyName =>
                <td key={elKey + propertyName}
                    className={summaryStyles.cell}
                >
                    {item[propertyName]}
                </td>
            )}
        </tr>
    );
}

