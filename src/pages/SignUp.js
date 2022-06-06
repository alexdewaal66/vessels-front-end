import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useRequestState, endpoints, postRequest } from '../helpers';
import { pages } from './index';
import { Menu, Main, Content } from '../pageLayouts';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl } from '../formLayouts';
import { ShowRequestState } from '../components';
import { logv, pathMkr, rootMkr } from '../dev/log';

function SignUp() {
    const logRoot = rootMkr(SignUp);
    const {handleSubmit, register} = useForm();
    const requestState = useRequestState();
    const history = useHistory();

    logv(logRoot,{requestState}, 'registration');

    function onSubmit(formData) {
        const logPath =  pathMkr(logRoot, onSubmit, '↓')
        logv(logPath, {formData});
        postRequest({
            endpoint: endpoints.signUp,
            payload: formData,
            requestState: requestState,
            onSuccess: () => {
                setTimeout(() => history.push(pages.signIn.path), 2000);
            },
        }).then();
    }

    return (
            <Content>
                <Main>
                    <h1>Registreren</h1>
                    <p>Registreer en log in om gegevens, foto's & commentaar te kunnen toevoegen.</p>
                    <ShowRequestState requestState={requestState}
                                      description={'het registreren '}
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
                <Menu>
                </Menu>
                {/*<Aside>*/}
                {/*    ASIDE*/}
                {/*</Aside>*/}
            </Content>
    );
}

export default SignUp;