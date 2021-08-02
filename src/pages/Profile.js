import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { addJwtToHeaders, getRequest, now, persistentVars } from '../helpers/utils';
import { useMountEffect, useRequestState } from '../helpers/customHooks';
import { entities } from '../helpers/endpoints';
import { Aside, Command, Main, Content } from '../pageLayouts';
import { pages } from './index';
import { ShowObject } from '../dev/ShowObject';
import { Stringify } from '../dev/Stringify';

function Profile() {
    const requestState = useRequestState();
    const {user} = useContext(AuthContext);
    console.log(`user=`, user);
/*
    // fully functional but obsolete:

    const [privateContent, setPrivateContent] = useState({});

    function fetchUserProfile() {
        console.log(now() + ' fetchUserProfile()');
        const Jwt = localStorage.getItem(persistentVars.Jwt);

        const { endpoint, id: [{name: idName}] } = entities.user;
        const id = user[idName];

        console.log('Jwt=', Jwt);
        getRequest({
            url: `${endpoint}/${id}`,
            headers: addJwtToHeaders({}, Jwt),
            requestState: requestState,
            onSuccess: setPrivateContent,
        })
    }

    useMountEffect(fetchUserProfile, []);
*/

    return (
        <Content>
            <Main>
                <h1>Profielpagina</h1>
                <section>
                    <h2>Gegevens</h2>
                    {/*privateContent: <Stringify data={privateContent} />*/}
                    {user &&
                    <>
                        <p><strong>Gebruikersnaam:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Land:</strong> {user.country}</p>
                        <p><strong>Api-key:</strong> {user.apikey}</p>
                        <p><strong>Enabled:</strong> {user.enabled ? <>Ja</> : <>Nee</>}</p>
                        <div><strong>Authorities:</strong> <ShowObject obj={user.authorities} /></div>
                    </>
                    }
                </section>
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