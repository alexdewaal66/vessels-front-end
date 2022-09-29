import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, CommandContextProvider } from '../contexts';
import { Menu, Main, Content } from '../pageLayouts';
import { pages } from './index';
// import { logv, rootMkr } from '../dev/log';
import { ShowObject } from '../components/ShowObject';
import { ShowStore } from '../dev/ShowStore';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { EditEntity } from '../components';
import { entityTypes, language } from '../helpers';

// const messages = {NL: {}, EN: {}};

function Profile() {
    // const logRoot = rootMkr(Profile);
    const {user} = useContext(AuthContext);
    // logv(logRoot, {user});
    const [item, setItem] = useState(null);

    // const TXT = messages[language()];

    //todo: use EntityN(entityTypes.user, user.username) without receiver
    //      to enable editing one's profile

    return (
        <Content>
            <Main>
                <CommandContextProvider>
                    <div className={pageLayout.splitView}>
                    <span className={pageLayout.firstPart}>
                        <section>
                            {user &&
                                <>
                                    <p><strong>Gebruikersnaam:</strong> {user.username}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Land:</strong> {user.country}</p>
                                    <p><strong>Enabled:</strong> {user.enabled ? <>Ja</> : <>Nee</>}</p>
                                    <div><strong>Authorities:</strong> <ShowObject data={user.authorities}/></div>
                                </>
                            }
                        </section>
                        <p>Terug naar de <Link to={pages.home.path}>Homepagina</Link></p>
                    </span>
                        <span className={pageLayout.secondPart}>
                        <EditEntity entityType={entityTypes.user}
                                    item={user} setItem={setItem}
                                    receiver={null}
                                    key={Profile.name + ` / EditEntity(${item?.id})`}
                                    elKey={Profile.name + ` / EditEntity(${item?.id})`}
                            // submitTime={submitTime}
                            // setSubmitTime={setSubmitTime}
                        />
                </span>
                    </div>
                </CommandContextProvider>
            </Main>
            <Menu>
            </Menu>
            <ShowStore/>
        </Content>

    );
}

export default Profile;