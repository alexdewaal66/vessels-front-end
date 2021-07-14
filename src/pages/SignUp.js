import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useForm} from 'react-hook-form';
// import axios from 'axios';
import { now, postRequest } from '../helpers/utils';
// import { requestStates } from '../helpers/utils';
import { pages } from './index';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';

function SignUp() {
    const {handleSubmit, register} = useForm();
    // const [requestState, setRequestState] = useState(requestStates.IDLE);
    const requestState = useRequestState();
    // const [requestError, setRequestError] = useState('');
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
                // <>Registreren is niet gelukt. Probeer het opnieuw. ({requestError})</>
                <>Registreren is niet gelukt. Probeer het opnieuw. ({requestState.error})</>
            )}
            {!requestState.isSuccess && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="email-field">
                        Email:
                        <input
                            type="email"
                            id="email-field"
                            name="email"
                            {...register("email")}
                        />
                    </label>

                    <label>
                        {/* TODO: */}
                        <span>Gebruikersnaam:</span>
                        <input
                            type="text"
                            id="username-field"
                            name="username"
                            {...register("username")}
                        />
                    </label>

                    <label htmlFor="password-field">
                        Wachtwoord:
                        <input
                            type="password"
                            id="password-field"
                            name="password"
                            {...register("password")}
                        />
                    </label>
                    <button
                        type="submit"
                        className="form-button"
                        disabled={requestState.isPending}
                    >
                        Maak account aan
                    </button>
                </form>
            )}

            <p>Heb je al een account? Je kunt je <Link to="/signin">hier</Link> inloggen.</p>
        </>
    );
}

export default SignUp;