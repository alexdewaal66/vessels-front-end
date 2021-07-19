import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getRequest, postRequest, makeRequest, now } from '../helpers/utils';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';
import layout from '../pageLayouts/layout.module.css';
import forms from '../formLayouts/forms.module.css';
import { Aside, Command, Main, Content } from '../pageLayouts';


export default function Entity({entityName, id}) {
    const {handleSubmit, register} = useForm();
    const requestState = useRequestState();
    const [entity, setEntity] = useState(null);

    function onSubmit(formData) {
    }

    function getEntity() {
        console.log(now() + 'getEntity()');
        makeRequest({
            method: 'get',
            url: endpoints.xyzs,
            headers: {},
            requestState,
            setResult: setEntity,
        })

    }
    const myEntity = ({a: 1, b: 2, c: 3, d: 4});

    useEffect(getEntity, [])

    return (
        <>
            <Content>
                <Main>
                    <h1>Entiteit</h1>
                    <section>
                        <h2>Gegevens</h2>
                        {myEntity &&
                        <>
                            {Object.entries(myEntity).map(([k, v]) => (
                                    <p>key={k} value={v}</p>
                                )
                            )}
                        </>
                        }
                    </section>
                </Main>
                <Command>
                    COMMAND
                </Command>
                <Aside>
                    ASIDE
                </Aside>
            </Content>
        </>
    );
}