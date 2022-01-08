import React, { createContext, useState } from 'react';
import { homeMenuItems } from '../pages/homeMenuItems';

export const ChoiceContext = createContext({});

export function ChoiceContextProvider({children}) {
    const [choice, setChoice] = useState(homeMenuItems.default);

    const makeChoice = c => () => setChoice(c);


    return (
        <ChoiceContext.Provider value={{choice, makeChoice}}>
                {children}
        </ChoiceContext.Provider>
    )
}
