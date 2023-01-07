import React, { useContext } from 'react';
import { makeEntityMenuItem } from './makeMenuItems';
import { ChoiceContext } from '../contexts';
import { Welcome } from '../components';
import { useMountEffect } from '../helpers';
import { Page } from './Page';
import { entityTypes } from '../helpers/globals/entityTypes';
import { Colors } from '../dev/Colors';
import { TestMultiSelect } from '../dev/TestMultiSelect';
import { Test } from '../dev/Test';
import { TestMultipartFile } from '../dev/TestMultipartFile';
import { TestCalculatingNumberInput } from '../dev/TestCalculatingNumberInput';
import { TestSorry } from '../dev/TestSorry';

const dev = true;
const separator = true;

const menuItems = [
    {label: {NL: 'Welkom', EN: 'Welcome'}, component: Welcome},
    {...makeEntityMenuItem(entityTypes.vessel)},
    {...makeEntityMenuItem(entityTypes.vesselType)},
    {...makeEntityMenuItem(entityTypes.vesselType, 21), dev},
    {...makeEntityMenuItem(entityTypes.hull)},
    {...makeEntityMenuItem(entityTypes.country)},
    {...makeEntityMenuItem(entityTypes.address)},
    {...makeEntityMenuItem(entityTypes.subdivision)},
    {...makeEntityMenuItem(entityTypes.unLocode)},
    {...makeEntityMenuItem(entityTypes.unLocode, 360), dev},
    {...makeEntityMenuItem(entityTypes.organisation)},
    {...makeEntityMenuItem(entityTypes.relation)},
    {...makeEntityMenuItem(entityTypes.relationType)},
    {...makeEntityMenuItem(entityTypes.propulsionType)},
    {...makeEntityMenuItem(entityTypes.operation)},
    {...makeEntityMenuItem(entityTypes.operationType)},
    {label: 'sep1', separator, dev},
    {...makeEntityMenuItem(entityTypes.xyz), dev},
    //  {...makeEntityMenuItem(entityTypes.xyz, 3), dev},
    {...makeEntityMenuItem(entityTypes.zyx), dev},
    {...makeEntityMenuItem(entityTypes.file), dev},
    {...makeEntityMenuItem(entityTypes.image), dev},
    {label: 'sep2', separator, dev},
    {label: {NL: 'Kleuren', EN: 'Colors'}, component: Colors, dev},
    {label: 'test multi-select', component: TestMultiSelect, dev},
    {label: 'test useDict', component: Test, dev},
    {label: {NL: 'test bestandsupload', EN: 'test file upload'}, component: TestMultipartFile, dev},
    {label: 'test calcInput', component: TestCalculatingNumberInput, dev},
    {label: 'sorry', component: TestSorry, dev},
    // focus: {label: 'Focus', componentName: OnFocusExample},
];

export default function Home() {
    const {choice, makeChoice, initChoice} = useContext(ChoiceContext);
    const ChosenComponent = choice.component || Welcome;


    useMountEffect(initChoice(menuItems[0]));

    return (
        <Page menuItems={menuItems} choice={choice} makeChoice={makeChoice}>
            {/*{(logv('-----HOME-----', {choice_label: choice.label}), '')}*/}
            <ChosenComponent/>
        </Page>
    );
}
