import React, { createContext, useEffect, useState } from 'react';
import { addJwtToHeaders, getRequest, now, persistentVars } from '../helpers/utils';
import jwt_decode from 'jwt-decode';
import { pages } from '../pages';
import { useHistory } from 'react-router-dom';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';
import layout from '../pageLayouts/layout.module.css'

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
            url: `${endpoints.users}${id}`,
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
                history.push(pages.profile.path);
            },
        })
    }

    function login(JWT) {
        const userID = getUserID(JWT);
        fetchUserData(JWT, userID);
    }

    function getUserID(JWT) {
        localStorage.setItem(persistentVars.JWT, JWT);
        const decodedToken = jwt_decode(JWT);
        return decodedToken.sub;
    }

    function logout() {
        console.log(now() + ' logout()');
        localStorage.removeItem(persistentVars.JWT);
        setAuthState({user:null});
    }

    function isTokenValid(JWT) {
        const decodedToken = jwt_decode(JWT);
        const expiration = decodedToken.exp * 1000; // Unix --> JS timestamp
        return expiration > (Date.now() + 500);
    }

    useEffect(() => {
        const JWT = localStorage.getItem(persistentVars.JWT);

        if (!authState.user && JWT && isTokenValid(JWT)) {
            // geen users, wel een geldige token
            const decodedToken = jwt_decode(JWT);
            fetchUserData(JWT, decodedToken.sub)
        } else {
            // geen users, geen geldige token
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
                    <span className={layout.statusbar}>authenticatie nog niet gestart</span>
                )}
                {requestState.isPending && (
                    <span className={layout.statusbar}>authenticatie is bezig</span>
                )}
                {requestState.isError && (
                    <span className={layout.statusbar}>authenticatie mislukt, ({requestState.errorMsg})</span>
                )}
                {requestState.isSuccess && (
                    <span className={layout.statusbar}>authenticatie geslaagd</span>
                )}
                {authState.status === authStates.PENDING
                    ? <p>Loading...</p>
                    : children
                }
            </>
        </AuthContext.Provider>
    )
}