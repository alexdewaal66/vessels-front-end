import React, { useContext } from 'react';
import { StatusContext } from '../contexts/StatusContext';
import { cx } from '../helpers';
import { pageLayout } from './index';

export function ShowStatus({className}) {
    const {statusMessage} = useContext(StatusContext);

    return (
        <aside className={cx(pageLayout.statusbar, className)}>
            {statusMessage}
        </aside>
    );
}
