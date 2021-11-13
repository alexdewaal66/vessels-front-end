import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Aside, Command, Main, Content } from '../pageLayouts';
import { pages } from './index';
import { ShowObject } from '../dev/ShowObject';

function Profile() {
    const {user} = useContext(AuthContext);
    console.log(`user=`, user);

    /*
    // fully functional but obsolete:

    const requestState = useRequestState();
    const [privateContent, setPrivateContent] = useState({});

    function fetchUserProfile() {
        console.log(now() + ' fetchUserProfile()');
        const JWT = localStorage.getItem(persistentVars.JWT);

        const { endpoint, id: [{name: idName}] } = entitiesMetadata.user;
        const id = user[idName];

        console.log('JWT=', JWT);
        getRequest({
            url: `${endpoint}/${id}`,
            headers: addJwtToHeaders({}, JWT),
            requestState: requestState,
            onSuccess: setPrivateContent,
        })
    }

    useMountEffect(fetchUserProfile, []);
*/

    //todo: use EntityN(entitiesMetadata.user, user.username) without receiver
    //      to enable editing one's profile

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
                        <p><strong>Enabled:</strong> {user.enabled ? <>Ja</> : <>Nee</>}</p>
                        <div><strong>Authorities:</strong> <ShowObject data={user.authorities} /></div>
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