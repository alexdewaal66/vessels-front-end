import { useContext, useEffect } from 'react';
import { MessageContext } from '../contexts/MessageContext';

export function Statusbar({children}) {
    const {setStatusMessage} = useContext(MessageContext);
    // const counter = useCounter(Statusbar.name, '', 1000, 50)

    useEffect(() => {
        setStatusMessage(children);
    }, [children, setStatusMessage]);

    return null;
}
