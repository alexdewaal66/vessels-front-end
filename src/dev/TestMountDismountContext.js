import React, {createContext, useEffect} from 'react';
import { logv } from './log';

export const TestMountDismountContext = createContext({});

export function TestMountDismountContextProvider({children}) {
    const logRoot = TestMountDismountContextProvider.name;
    // console.log(`➖➖➖➖➖➖ logRoot=`, logRoot);

    function onMount(data) {
        const logPath = `${logRoot} » ${onMount.name}()`;
        logv(logPath, {data});
    }

    function onDismount(data) {
        const logPath = `${logRoot} » ${onDismount.name}()`;
        logv(logPath, {data});
    }

    function useTestMountDismount() {
        useEffect(() => {
            onMount('#############  ALS  EERSTE  ##############');
            return () => {
                onDismount('##############  ALS  LAATSTE  ##################');
            }
        });
    }

    return (
        <TestMountDismountContext.Provider value={{useTestMountDismount}} >
            {children}
        </TestMountDismountContext.Provider>
    );
}