import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { addJwtToHeaders, getRequest, now, persistentVars } from '../Helpers/utils';
import { useRequestState } from '../Helpers/customHooks';
import { endpoints } from '../Helpers/endpoints';

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
            url: endpoints.profile,
            headers: addJwtToHeaders({}, token),
            requestState: requestState,
            setResult: setPrivateContent,
        })
    }

    useEffect(fetchUserProfile, []);

    return (
        <>
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
            <p>Terug naar de <Link to="/">Homepagina</Link></p>
        </>
    );
}

export default Profile;