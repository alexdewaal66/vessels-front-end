import React, { useContext } from 'react';
import { MessageContext } from '../contexts/MessageContext';
import { cx } from '../helpers';
import { pageLayout } from './index';

export function ShowStatus({className}) {
    const {statusMessage} = useContext(MessageContext);

    return (
        <aside className={cx(pageLayout.statusbar, className)}>
            {statusMessage}
        </aside>
    );
}
