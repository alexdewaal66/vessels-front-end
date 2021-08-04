import React, { createContext, useState } from 'react';
import { addJwtToHeaders, getRequest, now, persistentVars } from '../helpers/utils';
import jwt_decode from 'jwt-decode';
import { pages } from '../pages';
import { useHistory } from 'react-router-dom';
import { useRequestState, useMountEffect } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';
import { Statusbar } from '../pageLayouts/Statusbar';

export const AuthContext = createContext({});

export function AuthContextProvider({children}) {
    const authStates = {PENDING: 'pending', DONE: 'done'};
    const [authState, setAuthState] = useState({
        user: null,
        status: authStates.PENDING,
    });
    const requestState = useRequestState();
    const history = useHistory();
    const authData = {
        ...authState,
        login,
        logout
    };

    function fetchUserData(Jwt) {
        console.log('in fetchUserData()');
        const userID = getUserID(Jwt);
        getRequest({
            url: `${endpoints.users}${userID}`,
            headers: addJwtToHeaders({}, Jwt),
            requestState: requestState,
            onSuccess: (response) => {
                setAuthState({
                    user: response.data,
                    status: authStates.DONE,
                });
                history.push(pages.home.path);
            },
        })
    }

    // todo: move to helpers
    function getUserID(Jwt) {
        const decodedJwt = jwt_decode(Jwt);
        return decodedJwt.sub;
    }

    // todo: find more descriptive name
    function login(Jwt) {
        localStorage.setItem(persistentVars.JWT, Jwt);
        fetchUserData(Jwt);
    }

    function logout() {
        console.log(now() + ' logout()');
        localStorage.removeItem(persistentVars.JWT);
        setAuthState({
            user: null, status: authStates.DONE
        });
    }

    // todo: move to helpers
    function getJwtIfValid() {
        const Jwt = localStorage.getItem(persistentVars.JWT);
        if (!Jwt) return null;
        const decodedJwt = jwt_decode(Jwt);
        const expiration = decodedJwt.exp * 1000; // Unix --> JS timestamp
        const oneMinute = 60 * 1000;
        return expiration - Date.now() > oneMinute ? Jwt : null;
    }

    useMountEffect(() => {
        const Jwt = getJwtIfValid();
        if (!Jwt) {
            // geen geldige JWT
            logout();
        } else {
            if (!authState.user) {
                // wel geldige JWT, geen user
                fetchUserData(Jwt);
            } else {
                // wel geldige JWT en user
                setAuthState({
                    status: authStates.DONE
                });
            }
        }
    });


    return (
        <AuthContext.Provider value={authData}>
            <>
                {requestState.isIdle && (
                    <Statusbar>authenticatie nog niet gestart</Statusbar>
                )}
                {requestState.isPending && (
                    <Statusbar>authenticatie is bezig</Statusbar>
                )}
                {requestState.isError && (
                    <Statusbar>authenticatie mislukt, ({requestState.errorMsg})</Statusbar>
                )}
                {requestState.isSuccess && (
                    <Statusbar>authenticatie geslaagd</Statusbar>
                )}
                {authState.status === authStates.PENDING
                    ? <p>Loading...</p>
                    : children
                }
            </>
        </AuthContext.Provider>
    )
}