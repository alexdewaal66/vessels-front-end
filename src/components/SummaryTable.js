import React from 'react';
import summaryStyle from './summary.module.css';
import { SummaryHeading } from './SummaryHeading';
import { SummaryRow } from './SummaryRow';

export function SummaryTable({list, metadata, setEntity, entityName}) {
    return (
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
    );
}

