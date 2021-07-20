import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { addJwtToHeaders, getRequest, now, persistentVars } from '../helpers/utils';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';
import { Aside, Command, Main, Content } from '../pageLayouts';
import { pages } from './index';

function Profile() {
    const [privateContent, setPrivateContent] = useState({});
    const requestState = useRequestState();
    const {user} = useContext(AuthContext);
    console.log(`user=`, user);

    function fetchUserProfile() {
        console.log(now() + ' fetchUserProfile()');
        const token = localStorage.getItem(persistentVars.JWT);
        console.log('token=', token);
        getRequest({
            url: endpoints.users,
            headers: addJwtToHeaders({}, token),
            requestState: requestState,
            setResult: setPrivateContent,
        })
    }

    // useEffect(fetchUserProfile, []);

    return (
        <Content>
            <Main>
                <h1>Profielpagina</h1>
                <section>
                    <h2>Gegevens</h2>
                    {user &&
                    <>
                        <p><strong>Gebruikersnaam:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Land:</strong> {user.country}</p>
                    </>
                    }
                </section>
                {privateContent &&
                <section>
                    <h2>Afgeschermde content voor ingelogde gebruikers</h2>
                    <h4>{privateContent.title}</h4>
                    <p>{privateContent.content}</p>
                </section>
                }
                <p>Terug naar de <Link to={pages.home.path}>Homepagina</Link></p>
            </Main>
            <Command>
                COMMAND
            </Command>
            <Aside>
                ASIDE
            </Aside>
        </Content>

    );
}

export default Profile;