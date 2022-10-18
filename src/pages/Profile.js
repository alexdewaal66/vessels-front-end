import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, CommandContextProvider, StorageContext } from '../contexts';
import { Menu, Main, Content } from '../pageLayouts';
import { pages } from './index';
// import { logv, rootMkr } from '../dev/log';
import { ShowObject } from '../components/ShowObject';
import { ShowStore } from '../dev/ShowStore';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { EditEntity } from '../components';
import { entityNames, entityTypes, languageSelector, useConditionalEffect } from '../helpers';

const messages = {
    NL: {
        back: 'Terug naar de ',
        home: 'Startpagina',
    },
    EN: {
        back: 'Back to the ',
        home: 'Homepage'
    }
};

function Profile() {
    // const logRoot = rootMkr(Profile);
    const {user} = useContext(AuthContext);
    const storage = useContext(StorageContext);
    // logv(logRoot, {user});
    const [item, setItem] = useState(null);

    function storeEmail() {
        storage.writeItem(entityNames.user, user.id, user);
    }

    useConditionalEffect(!!user, storeEmail, [user]);

    const TXT = messages[languageSelector()];

    //todo: use EntityN(entityTypes.user, user.username) without receiver
    //      to enable editing one's profile

    return (
        <Content>
            <Main>
                <CommandContextProvider>
                    <div className={pageLayout.splitView}>
                    {/*<span className={pageLayout.firstPart}>*/}
                        {/*<section>*/}
                        {/*    {user &&*/}
                        {/*        <>*/}
                        {/*            <p><strong>Id:</strong> {user.id}</p>*/}
                        {/*            <p><strong>Gebruikersnaam:</strong> {user.username}</p>*/}
                        {/*            <p><strong>Email:</strong> {user.email}</p>*/}
                        {/*            <p><strong>Land:</strong> {user.country}</p>*/}
                        {/*            <p><strong>Enabled:</strong> {user.enabled ? <>Ja</> : <>Nee</>}</p>*/}
                        {/*            <div><strong>Authorities:</strong> <ShowObject data={user.authorities}/></div>*/}
                        {/*        </>*/}
                        {/*    }*/}
                        {/*</section>*/}
                        <p>{TXT.back}<Link to={pages.home.path}>{TXT.home}</Link>.</p>
                    {/*</span>*/}
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