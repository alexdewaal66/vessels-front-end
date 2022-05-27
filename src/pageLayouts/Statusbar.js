import { useContext, useEffect } from 'react';
import { MessageContext } from '../contexts/MessageContext';

export function Statusbar({children}) {
    const {updateStatusMessage} = useContext(MessageContext);

    useEffect(() => {
        updateStatusMessage(children);
    }, [children]);

    return null;
}
