import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { now, postRequest } from '../helpers/utils';
import { pages } from './index';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';
import layout from '../layouts/layout.module.css';
import forms from '../layouts/forms.module.css';
import { Aside, Command, Main } from '../layouts';

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
                setTimeout(() => history.push(pages.SignIn), 2000);
            },
        })
    }

    return (
        <>
            <div className={layout.container}>
                <Main>
                    <h1>Registreren</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id
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
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className={forms.fieldset}
                        >
                            <label className={forms.fieldline}>
                                <span className={forms.description}>Email:</span>
                                <input
                                    className={forms.input}
                                    type="email"
                                    id="email-field"
                                    name="email"
                                    {...register("email")}
                                />
                            </label>
                            <label className={forms.fieldline}>
                                <span className={forms.description}>Gebruikersnaam:</span>
                                <input
                                    className={forms.input}
                                    type="text"
                                    id="username-field"
                                    name="username"
                                    {...register("username")}
                                />
                            </label>

                            <label className={forms.fieldline}>
                                <span className={forms.description}>Wachtwoord:</span>
                                <input
                                    className={forms.input}
                                    type="password"
                                    id="password-field"
                                    name="password"
                                    {...register("password")}
                                />
                            </label>
                            <div className={forms.fieldline}>
                                <span className={forms.input}>
                                    <button
                                        type="submit"
                                        className="form-button"
                                        disabled={requestState.isPending}
                                    >
                                        Maak account aan
                                    </button>
                                </span>
                            </div>
                        </form>
                    )}

                    <p>Heb je al een account? Je kunt je <Link to={pages.SignIn}>hier</Link> inloggen.</p>
                </Main>
                <Command>
                    COMMAND
                </Command>
                <Aside>
                    ASIDE
                </Aside>
            </div>

        </>
    );
}

export default SignUp;