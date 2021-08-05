import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { now, postRequest } from '../helpers/utils';
import { pages } from './index';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';
import { Aside, Command, Main, Content } from '../pageLayouts';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl } from '../formLayouts';
import { ShowRequestState } from '../components/ShowRequestState';

function SignUp() {
    const {handleSubmit, register} = useForm();
    const requestState = useRequestState();
    const history = useHistory();

    console.log(now() + ' registration state:\n\t', requestState);

    function onSubmit(formData) {
        console.log(now() + ' onSubmit()');
        postRequest({
            url: endpoints.signUp,
            payload: formData,
            requestState: requestState,
            onSuccess: () => {
                setTimeout(() => history.push(pages.signIn.path), 2000);
            },
        })
    }

    return (
            <Content>
                <Main>
                    <h1>Registreren</h1>
                    <p>Registreer en log in om gegevens, foto's & commentaar te kunnen toevoegen.</p>
                    <ShowRequestState requestState={requestState}
                                      advice="Probeer het opnieuw. "
                    />
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
                                        disabled={requestState.isPending || requestState.isSuccess}
                                    >
                                        Maak account aan
                                    </button>
                                </FieldEl>
                            </FieldRow>
                        </Fieldset></Form>
                    )}

                    <p>Heb je al een account? Je kunt je <Link to={pages.signIn.path}>hier</Link> inloggen.</p>
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