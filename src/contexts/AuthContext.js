import React, { createContext, useEffect, useState } from 'react';
import { addJwtToHeaders, getRequest, now, persistentVars } from '../helpers/utils';
import jwt_decode from 'jwt-decode';
import { pages } from '../pages';
import { useHistory } from 'react-router-dom';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';

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
        logout,
    };

    function fetchUserData(JWT, id) {
        console.log('in fetchUserData()');
        getRequest({
            url: `${endpoints.user}${id}`,
            headers: addJwtToHeaders({}, JWT),
            requestState: requestState,
            onSuccess: (result) => {
                setAuthState({
                    user: {
                        username: result.username,
                        email: result.email,
                        id: result.id, // why?? we already have this id from the JWT
                        country: result.country,
                        // why not ...result ??
                    },
                    status: authStates.DONE,
                });
                history.push(pages.Profile);
            },
        })
    }

    function login(JWT) {
        console.log(now() + ' login()');
        localStorage.setItem(persistentVars.JWT, JWT);
        const decodedToken = jwt_decode(JWT);
        console.log(`decodedToken=`, decodedToken);
        const userID = decodedToken.sub; //

        fetchUserData(JWT, userID);
    }

    function logout() {
        console.log(now() + ' logout()');
    }

    function isTokenValid(JWT) {
        const decodedToken = jwt_decode(JWT);
        const expiration = decodedToken.exp * 1000; // Unix --> JS timestamp
        return expiration > (Date.now() + 500);
    }

    useEffect(() => {
        const JWT = localStorage.getItem(persistentVars.JWT);

        if (!authState.user && JWT && isTokenValid(JWT)) {
            // geen user, wel een geldige token
            const decodedToken = jwt_decode(JWT);
            fetchUserData(JWT, decodedToken.sub)
        } else {
            // geen user, geen geldige token
            setAuthState({
                user: null,
                status: authStates.DONE
            })
        }
    }, []);

    return (
        <AuthContext.Provider value={authData}>
            <>
                {requestState.isIdle && (
                    <span className="statusbar">FF lekker niksen...</span>
                )}
                {requestState.isPending && (
                    <span className="statusbar">We zijn onderweg.</span>
                )}
                {requestState.isError && (
                    <span className="statusbar">Foutje, bedankt! ({requestState.errorMsg})</span>
                )}
                {requestState.isSuccess && (
                    <span className="statusbar">Gelukt!!</span>
                )}
                {authState.status === authStates.PENDING
                    ? <p>Loading...</p>
                    : children
                }
            </>
        </AuthContext.Provider>
    )
}