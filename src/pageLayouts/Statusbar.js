import { useContext, useEffect } from 'react';
import { StatusContext } from '../contexts/StatusContext';

export function Statusbar({children}) {
    const {updateStatusMessage} = useContext(StatusContext);

    // const updateStatusMessage = useCallback(    (message) =>
    //     {
    //         if (message !== statusMessage) setStatusMessage(message);
    //     }
    // , [statusMessage]);


    useEffect(() => {
        updateStatusMessage(children);
    }, [children]);

    return null;
}
