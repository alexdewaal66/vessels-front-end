import React, { createContext, useState } from 'react';
import { Splash } from '../components/Splash';

const defaultItem = {label: Splash.name, component: Splash}

export const ChoiceContext = createContext(defaultItem);

export function ChoiceContextProvider({children}) {
    const [choice, setChoice] = useState(defaultItem);//homeMenuItems.default);

    const makeChoice = item => () => setChoice(item);

    const initChoice = initItem => () => {
        if (choice === defaultItem) setChoice(initItem);
    };


    return (
        <ChoiceContext.Provider value={{choice, makeChoice, initChoice}}>
                {children}
        </ChoiceContext.Provider>
    )
}
