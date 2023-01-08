import React, { useContext, useState } from 'react';
import { AuthContext, CommandContextProvider, StorageContext } from '../contexts';
import { EditEntity } from '../components';
import { useConditionalEffect } from '../helpers';
import { entityNames, entityTypes } from '../helpers/globals/entityTypes';

// const messages = {
//     NL: {
//         back: 'Terug naar de ',
//         home: 'Startpagina',
//     },
//     EN: {
//         back: 'Back to the ',
//         home: 'Homepage'
//     }
// };

export function ProfileComp() {
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

    // const TXT = messages[languageSelector()];

    //todo: use EntityN(entityTypes.user, user.username) without receiver
    //      to enable editing one's profile

    return (
        <>
            <CommandContextProvider>
                <EditEntity entityType={entityTypes.user}
                            item={user} setItem={setItem}
                            receiver={null}
                            key={ProfileComp.name + `/EditEntity(${item?.id})`}
                            elKey={ProfileComp.name + `/EditEntity(${item?.id})`}
                            onlyUpdate={true}
                />
            </CommandContextProvider>
        </>
    );
}
