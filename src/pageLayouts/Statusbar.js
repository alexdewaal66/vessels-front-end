import { useContext, useEffect } from 'react';
import { StatusContext } from '../contexts/StatusContext';

export function Statusbar({children}) {
    const {updateStatusMessage} = useContext(StatusContext);

    useEffect(() => {
        updateStatusMessage(children);
    }, [children]);

    return null;
}
