import React from 'react';
import { entityTypes } from '../helpers/globals/entityTypes';
import { makeMenu } from './makeMenu';
import { Welcome } from '../components/Welcome';
import { Page } from './Page';
import { Colors } from '../dev/Colors';
import { TestMultiSelect } from '../dev/TestMultiSelect';
import { Test } from '../dev/Test';
import { TestMultipartFile } from '../dev/TestMultipartFile';
import { TestCalculatingNumberInput } from '../dev/TestCalculatingNumberInput';
import { TestSorry } from '../dev/TestSorry';
import { PageRoutes } from './PageRoutes';

const dev = true;
const separator = true;
const isDefault = true;

export const shippingMenu = makeMenu('shipping', [
    {name: 'welcome', label: {NL: 'Welkom', EN: 'Welcome'}, Component: Welcome, isDefault},
    {entityType: entityTypes.vessel},
    {entityType: entityTypes.vesselType},
    {entityType: entityTypes.vesselType, id: 21, dev},
    {entityType: entityTypes.hull},
    {entityType: entityTypes.country},
    {entityType: entityTypes.address},
    {entityType: entityTypes.subdivision},
    {entityType: entityTypes.unLocode},
    {entityType: entityTypes.unLocode, id: 360, dev},
    {entityType: entityTypes.organisation},
    {entityType: entityTypes.relation},
    {entityType: entityTypes.relationType},
    {entityType: entityTypes.propulsionType},
    {entityType: entityTypes.operation},
    {entityType: entityTypes.operationType},
    {separator, dev},
    {entityType: entityTypes.xyz, dev},
    //  {entityType: entityTypes.xyz, id: 3, dev},
    {entityType: entityTypes.zyx, dev},
    {entityType: entityTypes.file, dev},
    {entityType: entityTypes.image, dev},
    {separator, dev},
    {name: 'colors', label: {NL: 'Kleuren', EN: 'Colors'}, Component: Colors, dev},
    {name: 'test-multi', label: 'test multi-select', Component: TestMultiSelect, dev},
    {name: 'test', label: 'test useDict', Component: Test, dev},
    {
        name: 'test-mp-file', label: {NL: 'test bestandsupload', EN: 'test file upload'},
        Component: TestMultipartFile, dev
    },
    {name: 'test-number-input', label: 'test calcInput', Component: TestCalculatingNumberInput, dev},
    {name: 'test-sorry', label: 'sorry', Component: TestSorry, dev},
    // {name: 'focus', label: 'Focus', Component: OnFocusExample},
]);


export function Shipping() {


    return (
        <Page menuItems={shippingMenu}>
            <PageRoutes menuItems={shippingMenu}/>
        </Page>
    );
}

