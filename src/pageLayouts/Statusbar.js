import React, { useContext } from 'react';
import { StatusContext } from '../contexts/StatusContext';

export function Statusbar({children}) {
    const {setStatusMessage} = useContext(StatusContext);
    setStatusMessage(children);
    return null;
}
