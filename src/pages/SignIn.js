import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { now, postRequest } from '../helpers/utils';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';
import forms from '../formLayouts/forms.module.css';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl } from '../formLayouts';
import { Aside, Command, Main } from '../pageLayouts';
import { Content } from '../pageLayouts/Content';

// import { pages } from './index';

function SignIn() {
    const {handleSubmit, register} = useForm();
    const authContext = useContext(AuthContext);
    const {login} = authContext;
    const requestState = useRequestState();
    console.log(now() + ` authContext=\n\t`, authContext);


    async function onSubmit(formData) {
        console.log(now() + ' onSubmit()');
        postRequest({
            url: endpoints.signIn,
            payload: formData,
            requestState: requestState,
            onSuccess: (result) => {
                login(result.jwt);
            },
        })
    }

    return (
        <Content>
            <Main>
                <h1>Inloggen</h1>
                <p>Log in om gegevens, foto's & commentaar te kunnen toevoegen.</p>

                {requestState.isPending && (
                    <>Even geduld a.u.b.</>
                )}
                {requestState.isSuccess && (
                    <>Inloggen is gelukt.</>
                )}
                {requestState.isError && (
                    <>Inloggen is niet gelukt. Probeer het opnieuw. ({requestState.errorMsg})</>
                )}
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
                                        disabled={requestState.isPending}
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
            <Command>
                COMMAND
            </Command>
            <Aside>
                ASIDE
            </Aside>
        </Content>
    );
}

export default SignIn;