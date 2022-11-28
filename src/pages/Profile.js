import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, CommandContextProvider, StorageContext } from '../contexts';
import { pages } from './index';
import pageLayout from '../pageLayouts/pageLayout.module.css';
import { EditEntity } from '../components';
import { languageSelector, useConditionalEffect } from '../helpers';
import { entityNames, entityTypes } from '../helpers/globals/entityTypes';
import { Page } from './Page';

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

export default function Profile() {
    // const logRoot = rootMkr(Profile);
    const {user} = useContext(AuthContext);
    const storage = useContext(StorageContext);
    // logv(logRoot, {user});
    const [item, setItem] = useState(null);

    function storeEmail() {
        // batch loading of users does not contain email addresses
        storage.writeItem(entityNames.user, user.id, user);
    }

    useConditionalEffect(!!user, storeEmail, [user]);

    const TXT = messages[languageSelector()];

    //todo: use EntityN(entityTypes.user, user.username) without receiver
    //      to enable editing one's profile

    return (
        <Page>
                <CommandContextProvider>
                    <div className={pageLayout.splitView}>
                        <p>{TXT.back}<Link to={pages.home.path}>{TXT.home}</Link>.</p>
                        <span className={pageLayout.secondPart}>
                        <EditEntity entityType={entityTypes.user}
                                    item={user} setItem={setItem}
                                    receiver={null}
                                    key={Profile.name + `/EditEntity(${item?.id})`}
                                    elKey={Profile.name + `/EditEntity(${item?.id})`}
                                    onlyUpdate={true}
                            // submitTime={submitTime}
                            // setSubmitTime={setSubmitTime}
                        />
                </span>
                    </div>
                </CommandContextProvider>
        </Page>
    );
}

