import { useContext, useEffect } from 'react';
import { StatusContext } from '../contexts/StatusContext';

export function Statusbar({children}) {
    const {setStatusMessage} = useContext(StatusContext);

    useEffect(() => {
        setStatusMessage(children);
    }, []);

    return null;
}
