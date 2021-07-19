import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { now, postRequest } from '../helpers/utils';
import { pageObjects } from './index';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';
import { Aside, Command, Main, Content } from '../pageLayouts';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl } from '../formLayouts';

function SignUp() {
    const {handleSubmit, register} = useForm();
    const requestState = useRequestState();
    const [result, setResult] = useState(null);
    const history = useHistory();

    console.log(now() + ' registration state:\n\t', requestState);

    function onSubmit(formData) {
        console.log(now() + ' onSubmit()');
        postRequest({
            url: endpoints.signUp,
            payload: formData,
            requestState: requestState,
            setResult: setResult,
            onSuccess: () => {
                setTimeout(() => history.push(pageObjects.signIn.path), 2000);
            },
        })
    }

    return (
            <Content>
                <Main>
                    <h1>Registreren</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga
                        id
                        molestias qui quo unde?</p>

                    {requestState.isPending && (
                        <>Even geduld a.u.b.</>
                    )}
                    {requestState.isSuccess && (
                        <>🎈🎈🎈 Registreren is gelukt. 🎈🎈🎈</>
                    )}
                    {requestState.isError && (
                        <>Registreren is niet gelukt. Probeer het opnieuw. ({requestState.error})</>
                    )}
                    {!requestState.isSuccess && (
                        <Form onSubmit={handleSubmit(onSubmit)}><Fieldset>
                            <FieldRow>
                                <FieldDesc>Email:</FieldDesc>
                                <FieldEl>
                                    <input
                                        type="email"
                                        id="email-field"
                                        name="email"
                                        {...register("email")}
                                    />
                                </FieldEl>
                            </FieldRow>
                            <FieldRow>
                                <FieldDesc>Gebruikersnaam:</FieldDesc>
                                <FieldEl>
                                    <input
                                        type="text"
                                        id="username-field"
                                        name="username"
                                        {...register("username")}
                                    />
                                </FieldEl>
                            </FieldRow>

                            <FieldRow>
                                <FieldDesc>Wachtwoord:</FieldDesc>
                                <FieldEl>
                                    <input
                                        type="password"
                                        id="password-field"
                                        name="password"
                                        {...register("password")}
                                    />
                                </FieldEl>
                            </FieldRow>
                            <FieldRow>
                                <FieldEl>
                                    <button
                                        type="submit"
                                        className="form-button"
                                        disabled={requestState.isPending}
                                    >
                                        Maak account aan
                                    </button>
                                </FieldEl>
                            </FieldRow>
                        </Fieldset></Form>
                    )}

                    <p>Heb je al een account? Je kunt je <Link to={pageObjects.signIn.path}>hier</Link> inloggen.</p>
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

export default SignUp;