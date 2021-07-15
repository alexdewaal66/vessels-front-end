import React from 'react';
import { useForm } from 'react-hook-form';
import { getRequest, postRequest, makeRequest} from '../helpers/utils';
import { useRequestState } from '../helpers/customHooks';
import { endpoints } from '../helpers/endpoints';
import layout from '../layouts/layout.module.css';
import forms from '../layouts/forms.module.css';
import { Aside, Command, Main } from '../layouts';


export default function Entity(props) {
    const { handleSubmit, register } = useForm();
    const requestState = useRequestState();

    function onSubmit(formData) {

    }

    return (
        <>

        </>
    );
}