import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { entityTypes } from '../helpers/globals/entityTypes';
import {
    capitalizeLabel, languageSelector, text,
    endpoints,
    postRequest, useRequestState, persistentVars
} from '../helpers';
import { pages } from './index';
import { FieldDesc, FieldEl, FieldRow, Fieldset, Form } from '../formLayouts';
import { ShowRequestState } from '../components';
import { logv, pathMkr, rootMkr } from '../dev/log';
import { Page } from './Page';

const messages = {
    NL: {
        signUp: 'Registreren',
        purpose: 'Registreer en log in om gegevens & foto\'s te kunnen toevoegen.',
        preLink: 'Heb je al een account? Je kunt ',
        linkText: 'hier',
        postLink: ' inloggen.',
        make: 'Maak account aan',
    },
    EN: {
        signUp: 'Register',
        purpose: 'Register and log in to add data and photos.',
        preLink: 'Already an account? Log in ',
        linkText: 'here',
        postLink: '.',
        make: 'Make account',
    },
};

export default function SignUp() {
    const logRoot = rootMkr(SignUp);
    const {handleSubmit, register} = useForm();
    const requestState = useRequestState();
    const history = useHistory();
    const userFields = {...entityTypes.user.fields, ...entityTypes.user.restrictedFields};

    logv(logRoot, {requestState}, 'registration');

    function onSubmit(formData) {
        const logPath = pathMkr(logRoot, onSubmit, '↓')
        logv(logPath, {formData});
        localStorage.removeItem(persistentVars.JWT);
        postRequest({
            endpoint: endpoints.signUp,
            payload: formData,
            requestState: requestState,
            onSuccess: () => {
                setTimeout(() => history.push(pages.signIn.path), 2000);
            },
        }).then();
    }

    const TXT = messages[languageSelector()];

    return (
        <Page>
            <h1>{TXT.signUp}</h1>
            <p>{TXT.purpose}</p>
            <ShowRequestState requestState={requestState}
                              description={text({NL: 'het registreren ', EN: 'registration '})}
                              advice={text({NL: 'Probeer het opnieuw. ', EN: 'try again '})}
            />
            {!requestState.isSuccess && (
                <Form onSubmit={handleSubmit(onSubmit)}><Fieldset>
                    <FieldRow>
                        <FieldDesc>{capitalizeLabel(userFields.email)}:</FieldDesc>
                        <FieldEl>
                            <input
                                type="email"
                                id="email-field"
                                name="email"
                                {...register("email", userFields.email.validation)}
                            />
                        </FieldEl>
                    </FieldRow>
                    <FieldRow>
                        <FieldDesc>{capitalizeLabel(userFields.username)}:</FieldDesc>
                        <FieldEl>
                            <input
                                type="text"
                                id="username-field"
                                name="username"
                                {...register("username", userFields.username.validation)}
                            />
                        </FieldEl>
                    </FieldRow>

                    <FieldRow>
                        <FieldDesc>{capitalizeLabel(userFields.password)}:</FieldDesc>
                        <FieldEl>
                            <input
                                type="password"
                                id="password-field"
                                name="password"
                                {...register("password", userFields.password.validation)}
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
                                {TXT.make}
                            </button>
                        </FieldEl>
                    </FieldRow>
                </Fieldset></Form>
            )}

            <p>{TXT.preLink}<Link to={pages.signIn.path}>{TXT.linkText}</Link>{TXT.postLink}</p>
        </Page>
    );
}
