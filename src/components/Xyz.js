import React, { useState } from 'react';
import { entities } from '../helpers/endpoints';
import { useForm } from 'react-hook-form';
import { now } from '../helpers/utils';
import { EditEntity } from './EditEntity';
import { SummaryList } from './summaryList';

export function Xyz({id = 0}) {
    const useFormFunctions = useForm();
    const [list, setList] = useState(null);
    const [item, setItem] = useState(null);
    console.log(`item=`, item);
    const {xyz: metadata} = entities;
    // const { id: [{name: idName}]} = metadata;


    function updateList(newList, selectedId = id) {
        console.log(now() + ` updateList() selectedId=`, selectedId);
        newList.sort((a, b) => a.id - b.id);
        setList(newList);
        const selectedItem = newList.find(item => item.id === selectedId);
        updateEditForm(selectedItem || newList[0]);
    }

    function updateEditForm(changedItem) {
        setItem(changedItem);
        useFormFunctions.reset();
    }

    const onEditChange = {
        update: (formData) => {
            const index = list.findIndex(item => item.id === formData.id);
            console.log(now() + ` onChange.update() index=`, index);
            const newList = [...list.slice(0, index), formData, ...list.slice(index + 1)];
            updateList(newList, formData.id);
        },
        create: (formData) => {
            const newList = [...list, formData];
            updateList(newList, formData.id);
        },
        delete: (formData) => {
            const index = list.findIndex(item => item.id === formData.id);
            const newList = [...list.slice(0, index), ...list.slice(index + 1)];
            updateList(newList);
        },
    }


    return (
        <>
            <h4>{metadata.label}</h4>
            <SummaryList metadata={metadata}
                         list={list}
                         updateList={updateList}
                         updateEditForm={updateEditForm}
            />
            {(item?.id || list) && (
                <EditEntity entity={item || list[0]}
                            useFormFunctions={useFormFunctions}
                            metadata={metadata}
                            onChange={onEditChange}
                />
            )}
        </>
    );
}

