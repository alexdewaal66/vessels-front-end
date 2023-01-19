import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthContext, StorageContext } from "../contexts";
import { entityTypes, entityNames } from '../helpers/globals/entityTypes';
import {
    useRequestState,
    endpoints,
    persistentVars,
    postRequest,
    languageSelector,
    capitalizeLabel, text, devHints
} from '../helpers';
import { formStyles } from '../formLayouts';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl } from '../formLayouts';
import { ShowRequestState, ValidationMessage } from '../components';
import { Page } from './Page';
import { logv, pathMkr, rootMkr } from '../dev/log';

const messages = {
    NL: {
        signIn: 'Inloggen',
        purpose: 'Log in om gegevens & foto\'s te kunnen toevoegen.',
        preLink: 'Heb je nog geen account? ',
        linkText: 'Registreer',
        postLink: ' je dan eerst.',
        valid: 'formulier juist ingevuld',
        pending: 'formulier wordt verzonden',
        success: 'inloggen gelukt',
        error: 'inloggen niet gelukt',
    },
    EN: {
        signIn: 'Log in',
        purpose: 'Log in to add data and photos.',
        preLink: 'No account yet? ',
        linkText: 'Register',
        postLink: ' first.',
        valid: 'all form inputs are valid',
        pending: 'sending form',
        success: 'login succeeded',
        error: 'login failed',
    }
};

export function SignIn() {
    const logRoot = rootMkr(SignIn);
    const form = useForm({mode: 'onChange'});
    const {handleSubmit, register, formState,} = form;
    const authContext = useContext(AuthContext);
    const {fetchUserData} = authContext;
    const storage = useContext(StorageContext);

    const requestState = useRequestState();
    const userFields = entityTypes.user.fields;

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

    // logv(logRoot, {authContext, userFields});

    function couldLoadUserData() {
        const logPath = pathMkr(logRoot, couldLoadUserData);
        logv(logPath, null, 'HOORAY!');
    }

    function couldNOTLoadUserData() {
        const logPath = pathMkr(logRoot, couldNOTLoadUserData);
        logv(logPath, null, 'BUGGER!');
    }

    async function onSubmit(formData) {
        const logPath = pathMkr(logRoot, onSubmit, '↓')
        logv(logPath, {formData});
        postRequest({
            endpoint: endpoints.signIn,
            payload: formData,
            requestState: requestState,
            onSuccess: (response) => {
                localStorage.setItem(persistentVars.JWT, response.data.jwt);
                fetchUserData();
                // logv(logPath, {data: response.data});
                storage.loadAllItems(entityNames.user,
                    couldLoadUserData,
                    couldNOTLoadUserData);
            },
        })
    }

    return (
        <Page>
            <h1>{TXT.signIn}</h1>
            <p>{TXT.purpose}</p>
            <ShowRequestState requestState={requestState}
                              description={text({NL: 'het inloggen ', EN: 'login '})}
                              advice={text({NL: 'Probeer het opnieuw. ', EN: 'Try again.'})}
            />
            {!requestState.isSuccess && (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Fieldset>
                        {/*<FieldRow>*/}
                        {/*    <FieldDesc>{capitalizeLabel(userFields.email)}:</FieldDesc>*/}
                        {/*    <FieldEl><input*/}
                        {/*        type="email"*/}
                        {/*        name="email"*/}
                        {/*        {...register("email")}*/}
                        {/*    /></FieldEl>*/}
                        {/*</FieldRow>*/}

                        <FieldRow>
                            <FieldDesc>{capitalizeLabel(userFields.username)}:</FieldDesc>
                            <FieldEl>
                                <input
                                    type="text"
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
                                    className={formStyles.cell}
                                    type="password"
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
                                    {TXT.signIn}
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
                    </Fieldset>
                </Form>
            )}

            <p>{TXT.preLink}<Link to="/signup">{TXT.linkText}</Link>{TXT.postLink}</p>
        </Page>
    );
}
