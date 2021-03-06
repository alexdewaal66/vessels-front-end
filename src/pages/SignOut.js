import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { Aside, Menu, Main } from '../pageLayouts';
import { Content } from '../pageLayouts';
import { pages } from './index';

function SignOut() {
    // const logRoot = rootMkr(SignOut);
    const history = useHistory();
    const {handleSubmit} = useForm();
    const authContext = useContext(AuthContext);
    const {logout} = authContext;
    // logv(logRoot, {authContext});


    function onSubmit(formData) {
        // const logPath =  pathMkr(logRoot, onSubmit, '↓')
        // logv(logPath, {formData});
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
                    >
                        Log uit
                    </button>
                </form>
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

export default SignOut;