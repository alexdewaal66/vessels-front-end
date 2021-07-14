import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { now, postRequest } from '../Helpers/utils';
import { useRequestState } from '../Helpers/customHooks';
import { endpoints } from '../Helpers/endpoints';
// import { pages } from './index';

function SignIn() {
    const { handleSubmit, register } = useForm();
    const authContext = useContext(AuthContext);
    const { login } = authContext;
    const requestState = useRequestState();
    console.log(now() + ` authContext=\n\t`, authContext);


    async function onSubmit(formData) {
        console.log(now() + ' onSubmit()');
        postRequest({
            url: endpoints.signIn,
            payload: formData,
            requestState: requestState,
            onSuccess: (result) => {
                login(result.accessToken);
            },
        })
    }

    return (
        <>
            <h1>Inloggen</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id
                molestias qui quo unde?</p>

            {requestState.isPending && (
                <>Even geduld a.u.b.</>
            )}
            {requestState.isSuccess && (
                <>🎈🎈🎈 Inloggen is gelukt. 🎈🎈🎈</>
            )}
            {requestState.isError && (
                // <>Inloggen is niet gelukt. Probeer het opnieuw. ({requestError})</>
                <>Inloggen is niet gelukt. Probeer het opnieuw. ({requestState.errorMsg})</>
            )}
            {!requestState.isSuccess && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="email-field">
                        Emailadres:
                        <input
                            type="email"
                            id="email-field"
                            name="email"
                            {...register("email")}
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
                        Inloggen
                    </button>
                </form>
            )}


            <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
        </>
    );
}

export default SignIn;