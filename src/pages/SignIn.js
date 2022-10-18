import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthContext } from "../contexts";
import {
    useRequestState,
    endpoints,
    persistentVars,
    postRequest,
    languageSelector,
    entityTypes,
    capitalizeLabel, text
} from '../helpers';
import { formStyles } from '../formLayouts';
import { Form, Fieldset, FieldRow, FieldDesc, FieldEl } from '../formLayouts';
import { Menu, Main } from '../pageLayouts';
import { Content } from '../pageLayouts';
import { ShowRequestState, ValidationMessage } from '../components';

const messages = {
    NL: {
        signIn: 'Inloggen',
        purpose: 'Log in om gegevens & foto\'s te kunnen toevoegen.',
        preLink: 'Heb je nog geen account? ',
        linkText: 'Registreer',
        postLink: ' je dan eerst.',
        invalid: 'formulier niet juist ingevuld',
        pending: 'formulier wordt verzonden',
        ineligible: 'geen autorisatie om te wijzigen/verwijderen',
        update: 'Wijzig',
        create: 'Maak nieuw',
        delete: 'Verwijder',
    },
    EN: {
        signIn: 'Log in',
        purpose: 'Log in to add data and photos.',
        preLink: 'No account yet? ',
        linkText: 'Register',
        postLink: ' first.',
        invalid: 'form has invalid inputs',
        pending: 'sending form',
        ineligible: 'no authorisation to update/delete',
        update: 'Update',
        create: 'Create',
        delete: 'Delete',
    }
};

function SignIn() {
    // const logRoot = rootMkr(SignIn);
    const form = useForm();
    const {handleSubmit, register, formState} = form;
    const authContext = useContext(AuthContext);
    const {fetchUserData} = authContext;
    const requestState = useRequestState();
    const userFields = {...entityTypes.user.fields, ...entityTypes.user.restrictedFields};

    // logv(logRoot, {authContext});

    const TXT = messages[languageSelector()];

    const {isValid} = formState;
    const hintValid = !isValid && TXT.invalid;
    const {isPending} = requestState;
    const hintPending = isPending && TXT.pending;
    const isDisabled = isPending || !isValid;

    // const hintEligible = !isEligible && TXT.ineligible;

    function style(condition) {
        return condition ? formStyles.disabled : formStyles.enabled;
    }

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
                            <FieldRow>
                                <FieldEl>
                                    <button
                                        type="submit"
                                        className="form-button"
                                        disabled={requestState.isPending || requestState.isSuccess}
                                    >
                                        {TXT.signIn}
                                    </button>
                                </FieldEl>
                            </FieldRow>
                        </Fieldset>
                    </Form>
                )}

                <p>{TXT.preLink}<Link to="/signup">{TXT.linkText}</Link>{TXT.postLink}</p>
            </Main>
            <Menu>
            </Menu>
            {/*<Aside>*/}
            {/*    ASIDE*/}
            {/*</Aside>*/}
        </Content>
    );
}

export default SignIn;