import React from 'react';
import { SummaryHeading, SummaryRow, summaryStyle } from './';

export function SummaryTable({list, metadata, setEntity}) {
    const entityName = metadata.name;

    return (
        <div className={summaryStyle.tableFixHead}>
            <table className={summaryStyle.table}>
                <thead>
                <SummaryHeading metadata={metadata} elKey={entityName}/>
                </thead>
                <tbody>
                {list.map(item => (
                    <SummaryRow item={item}
                                metadata={metadata}
                                setDetails={setEntity}
                                elKey={entityName + item.id}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}

