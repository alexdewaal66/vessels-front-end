import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { now } from '../helpers/utils';
import { useRequestState } from '../helpers/customHooks';
import { Aside, Command, Main } from '../pageLayouts';
import { Content } from '../pageLayouts/Content';
import { pages } from './index';

function SignIn() {
    const history = useHistory();
    const {handleSubmit} = useForm();
    const authContext = useContext(AuthContext);
    const {logout} = authContext;
    const requestState = useRequestState();
    console.log(now() + ` authContext=\n\t`, authContext);


    function onSubmit(formData) {
        console.log(now() + ' onSubmit()');
        logout();
        history.push(pages.home.path);
    }

    return (
        <Content>
            <Main>
                <h1>Uitloggen</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <button
                        type="submit"
                        className="form-button"
                        disabled={requestState.isPending}
                    >
                        Log uit
                    </button>
                </form>
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