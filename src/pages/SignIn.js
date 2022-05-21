import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthContext } from "../contexts";
import { useRequestState, endpoints, persistentVars, postRequest } from '../helpers';
import forms from '../formLayouts/forms.module.css';//todo: forms --> formStyles
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl } from '../formLayouts';
import { Aside, Menu, Main } from '../pageLayouts';
import { Content } from '../pageLayouts';
import { ShowRequestState } from '../components';


function SignIn() {
    // const logRoot = rootMkr(SignIn);
    const {handleSubmit, register} = useForm();
    const authContext = useContext(AuthContext);
    const {fetchUserData} = authContext;
    const requestState = useRequestState();
    // logv(logRoot, {authContext});


    async function onSubmit(formData) {
        // const logPath =  pathMkr(logRoot, onSubmit, '↓')
        // logv(logPath, {formData});
        postRequest({
            endpoint: endpoints.signIn,
            payload: formData,
            requestState: requestState,
            onSuccess: (response) => {
                localStorage.setItem(persistentVars.JWT, response.data.jwt);
                fetchUserData();
            },
        })
    }

    return (
        <Content>
            <Main>
                <h1>Inloggen</h1>
                <p>Log in om gegevens, foto's & commentaar te kunnen toevoegen.</p>
                <ShowRequestState requestState={requestState}
                                  description={'het inloggen '}
                                  advice="Probeer het opnieuw. "
                />
                {!requestState.isSuccess && (
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Fieldset>
                            <FieldRow>
                                <FieldDesc>Emailadres:</FieldDesc>
                                <FieldEl><input
                                    type="email"
                                    name="email"
                                    {...register("email")}
                                /></FieldEl>
                            </FieldRow>

                            <FieldRow>
                                <FieldDesc>Username:</FieldDesc>
                                <FieldEl><input
                                    type="text"
                                    name="username"
                                    {...register("username")}
                                /></FieldEl>
                            </FieldRow>

                            <FieldRow>
                                <FieldDesc>Wachtwoord:</FieldDesc>
                                <FieldEl><input
                                    className={forms.cell}
                                    type="password"
                                    name="password"
                                    {...register("password")}
                                /></FieldEl>
                            </FieldRow>
                            <FieldRow>
                                <FieldEl>
                                    <button
                                        type="submit"
                                        className="form-button"
                                        disabled={requestState.isPending || requestState.isSuccess}
                                    >
                                        Inloggen
                                    </button>
                                </FieldEl>
                            </FieldRow>
                        </Fieldset>
                    </Form>
                )}

                <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
            </Main>
            <Menu>
                COMMAND
            </Menu>
            <Aside>
                ASIDE
            </Aside>
        </Content>
    );
}

export default SignIn;