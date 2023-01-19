import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { endpoints, getRequest, persistentVars, useMountEffect, useRequestState } from '../helpers';
import { authorities, levels } from '../helpers/globals/levels';
import { Statusbar } from '../pageLayouts/Statusbar';
import { logCondition, logv, pathMkr, rootMkr } from '../dev/log';
import { StorageContext } from './StorageContext';

export const AuthContext = createContext({});


export function AuthContextProvider({children}) {
    const logRoot = rootMkr(AuthContextProvider);
    const doLog = logCondition(AuthContextProvider, '*')
    const storage = useContext(StorageContext);
    const authStates = {PENDING: 'pending', DONE: 'done'};
    const [authState, setAuthState] = useState({});
    //     user: {username: null},
    //     authorities: [{username: null, role: null}],
    //     status: authStates.PENDING,
    // });
    const requestState = useRequestState();
    const navigate = useNavigate();
    const authData = {
        ...authState,
        fetchUserData,
        logout,
        isEligibleToChange,
        getUserAuthorities,
        isAdmin,
        getHighestLevel,
        getRoles,
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
                navigate('/');
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
                fetchUserData();
            } else {
                // wel geldige JWT en user
                setAuthState({
                    status: authStates.DONE
                });
            }
        }
    });


    /*
         owner  │  user   │  u == o  │  higherRole  ║  eligible
        ────────┼─────────┼──────────┼──────────────╫───────────
          *     │  null   │    *     │       *      ║     0
         null   │  Alice  │    *     │       *      ║     1
         Bob    │  Alice  │    0     │       0      ║     0
         Bob    │  Alice  │    *     │       1      ║     1
         Bob    │  Bob    │    1     │       *      ║     1
    */
    function isEligibleToChange(item) {
        // const logPath = pathMkr(logRoot, isEligibleToChange);
        // logv(logPath, {item, authState}, '🔎🔎🔎');
        return !!authState.user && (
            !item?.owner
            || authState.user.username === item.owner
            || hasUserHigherRoleThan(item.owner)
        );
    }

    function getUserAuthorities(item) {
        const logPath = pathMkr(logRoot, getUserAuthorities);
        if (!authState.user) return;
        const userAuthorities = getRoles();
        if (!!item && authState.user.username === item?.username) userAuthorities.push(authorities.SELF);
        if (doLog) logv(logPath,{userAuthorities, item});
        return userAuthorities;
    }

    function hasUserHigherRoleThan(ownerName) {
        // const logPath = pathMkr(logRoot, hasUserHigherRoleThan);
        const userLevel = getHighestLevel();
        const ownerLevel = getHighestLevel(ownerName);
        // logv(logPath, {userLevel, ownerLevel});
        return userLevel > ownerLevel;
    }

    function isAdmin() {
        return getHighestLevel() === levels.ROLE_ADMIN;
    }

    function getHighestLevel(username) {
        let highest = levels.ROLE_MEMBER;
        // if (!username) return highest;
        getRoles(username)?.forEach(role => {
            if (levels[role] > highest) highest = levels[role];
        });
        return highest;
    }

    function getRoles(username) {
        // const logPath = pathMkr(logRoot, getRoles, username);
        // let logPrompt;
        let user;
        if (!username) {
            user = authState.user;
            // logPrompt = 'authstate';
        } else {
            user = storage.findItems('user', {username})[0];
            // logPrompt = 'findItems()';
        }
        // logv(logPath, {user}, logPrompt);
        const roleList = user?.roles.map(role => role.name);
        // logv(logPath, {username, user, roleList});
        return roleList;
    }

    // const counter = useCounter(logRoot, '', 1000,  50);
    // if (counter.passed) return <Sorry context={logRoot} counter={counter}/>;

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

