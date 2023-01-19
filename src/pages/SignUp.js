import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { entityTypes } from '../helpers/globals/entityTypes';
import {
    capitalizeLabel, languageSelector, text,
    endpoints,
    postRequest, useRequestState, persistentVars, devHints
} from '../helpers';
import { pages } from './pages';
import { FieldDesc, FieldEl, FieldRow, Fieldset, Form, formStyles } from '../formLayouts';
import { ShowRequestState, ValidationMessage } from '../components';
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
        valid: 'formulier juist ingevuld',
        pending: 'formulier wordt verzonden',
        success: 'registreren gelukt',
        error: 'registreren niet gelukt',
    },
    EN: {
        signUp: 'Register',
        purpose: 'Register and log in to add data and photos.',
        preLink: 'Already an account? Log in ',
        linkText: 'here',
        postLink: '.',
        make: 'Make account',
        valid: 'all form inputs are valid',
        pending: 'sending form',
        success: 'sign up succeeded',
        error: 'sign up failed',
    },
};

export function SignUp() {
    const logRoot = rootMkr(SignUp);
    const form = useForm({mode: 'onChange'});
    const {handleSubmit, register, formState,} = form;
    const requestState = useRequestState();
    const navigate = useNavigate();
    const userFields = entityTypes.user.fields;

    logv(logRoot, {requestState}, '--- Registration --- \n');

    function onSubmit(formData) {
        const logPath = pathMkr(logRoot, onSubmit, '↓')
        logv(logPath, {formData});
        localStorage.removeItem(persistentVars.JWT);
        postRequest({
            endpoint: endpoints.signUp,
            payload: formData,
            requestState: requestState,
            onSuccess: () => {
                setTimeout(() => navigate(pages.signIn.path), 2000);
            },
        }).then();
    }

    const TXT = messages[languageSelector()];

    const {isValid} = formState;
    const hintValid = TXT.valid + ' : ' + isValid;
    const {isPending, isSuccess, isError} = requestState;
    const hintPending = TXT.pending + ' : ' + isPending;
    const hintSuccess = TXT.success + ' : ' + isSuccess;
    const isDisabled = isPending || !isValid || isSuccess;

    function style(condition) {
        return condition ? formStyles.disabled : formStyles.enabled;
    }

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
                            <ValidationMessage form={form} fieldName={'email'}/>
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
                            <ValidationMessage form={form} fieldName={'username'}/>
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
                            <ValidationMessage form={form} fieldName={'password'}/>
                        </FieldEl>
                    </FieldRow>
                    <FieldRow title={devHints(hintPending, hintValid, hintSuccess)}>
                        <FieldEl>
                            <button
                                type="submit"
                                className={style(isDisabled)}
                                disabled={isDisabled}
                            >
                                {TXT.make}
                            </button>
                        </FieldEl>
                        <FieldEl>
                            {isError && (
                                <span className={formStyles.error}>
                                    {TXT.error}
                                </span>
                            )}
                        </FieldEl>
                    </FieldRow>
                </Fieldset></Form>
            )}

            <p>{TXT.preLink}<Link to={pages.signIn.path}>{TXT.linkText}</Link>{TXT.postLink}</p>
        </Page>
    );
}
