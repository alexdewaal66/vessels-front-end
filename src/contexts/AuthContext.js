import React, { createContext, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { getRequest, persistentVars, useRequestState, useMountEffect, endpoints } from '../helpers';
import { pages } from '../pages';
import { Statusbar } from '../pageLayouts';
import { logv, pathMkr, rootMkr } from '../dev/log';
import { StorageContext } from './StorageContext';
import { entityNames } from '../helpers';

export const AuthContext = createContext({});

const levels = {
    ROLE_MEMBER: 1,
    ROLE_EXPERT: 2,
    ROLE_ADMIN: 3,
    ROLE_DEMIURG: 4,
}


export function AuthContextProvider({children}) {
    const logRoot = rootMkr(AuthContextProvider);
    const storage = useContext(StorageContext);
    const authStates = {PENDING: 'pending', DONE: 'done'};
    const [authState, setAuthState] = useState({});
    //     user: {username: null},
    //     authorities: [{username: null, role: null}],
    //     status: authStates.PENDING,
    // });
    const requestState = useRequestState();
    const history = useHistory();
    const authData = {
        ...authState,
        fetchUserData,
        logout,
        isEligibleToChange
    };

    function fetchUserData() {
        const logPath = pathMkr(logRoot, fetchUserData);
        const username = getUsername(localStorage.getItem(persistentVars.JWT));
        // logv(logPath, {username});
        getRequest({
            endpoint: `${endpoints.users}${username}`,
            requestState: requestState,
            onSuccess: (response) => {
                // logv(logPath, {response}, '✔');
                setAuthState({
                    user: response.data,
                    status: authStates.DONE,
                });
                history.push(pages.home.path);
            },
            onFail: (error) => {
                logv(logPath, {error}, '❌');
            }
        })
    }

    // todo: move to helpers?
    function getUsername(Jwt) {
        const decodedJwt = jwt_decode(Jwt);
        return decodedJwt.sub;
    }


    function logout() {
        // const logPath = pathMkr(logRoot, logout);
        // logv(logPath);
        localStorage.removeItem(persistentVars.JWT);
        setAuthState({
            user: null, status: authStates.DONE
        });
    }

    function getJwtIfValid() {
        const Jwt = localStorage.getItem(persistentVars.JWT);
        if (!Jwt) return null;
        const decodedJwt = jwt_decode(Jwt);
        const expiration = decodedJwt.exp * 1000; // Unix --> JS timestamp
        const oneMinute = 60 * 1000;
        return expiration - Date.now() > oneMinute ? Jwt : null;
    }

    useMountEffect(function checkJwtAndActAccordingly() {
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

    // function isEligibleToChange(item) {
    //     return !(item?.owner && authState?.user)
    //         || authState.user.username === item.owner
    //         || hasUserHigherRoleThan(item.owner);
    // }

/*
    owner       user        U == O      higherRole      ||      eligible
    --------------------------------------------------------------------
      *         null           *             *          ||         0
    null          X            *             *          ||         1
      Y           X            0             0          ||         0
      Y           X            *             1          ||         1
      Y           Y            1             *          ||         1
*/
    function isEligibleToChange(item) {
        return  !!authState.user && (
            !item?.owner
            || authState.user.username === item.owner
            || hasUserHigherRoleThan(item.owner)
        );
    }



    function hasUserHigherRoleThan(username) {
        return getHighestLevel() > getHighestLevel(username);
    }

    function getHighestLevel(username) {
        let highest = levels.ROLE_MEMBER;
        // if (!username) return highest;
        getRoles(username).forEach(role => {
            if (levels[role] > highest) highest = levels[role];
        });
        return highest;
    }

    function getRoles(username) {
        const logPath = pathMkr(logRoot, getRoles, username);
        const user = !username
            ? (console.log('👀authstate'), authState.user)
            : (console.log('👀findItems()'), storage.findItems(entityNames.user, {username})[0]);
        logv(logPath, {user});
        // return user.authorities.map(a => a.role);// before roles as entity
        const roleList = user.roles.map(role => role.name);
        logv(pathMkr(logRoot, getRoles), {username, user, roleList});
        return roleList;
    }


    return (
        <AuthContext.Provider value={authData}>
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
        </AuthContext.Provider>
    )
}