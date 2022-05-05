import React, { useContext } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChoiceContext, ChoiceContextProvider } from '../../contexts';


describe('ChoiceContext', () => {
    function Candidate1() {
        return <div>Candidate-1</div>
    }

    function Candidate2() {
        return <button name="Candidate-2">Candidate-2</button>
    }

    const items = {
        c1: {label: Candidate1.name, component: Candidate1},
        c2: {label: Candidate2.name, component: Candidate2},
    }

    function TestComponent({item}) {
        const {choice, makeChoice} = useContext(ChoiceContext);
        const ChosenComponent = choice.component;
        return <>
            <div role="choice_role"><ChosenComponent/></div>
            <button onClick={makeChoice(item)}>{item.label}</button>
        </>
    }

    describe('When user makes the choice', () => {

        test('Candidate-1', () => {
            const item = items.c1;
            render(
                <ChoiceContextProvider>
                    <TestComponent item={item}/>
                </ChoiceContextProvider>
            );

            expect(screen.getByRole('choice_role')).toBeInTheDocument();
            fireEvent.click(screen.getByRole('button', {name: item.label}));
            expect(screen.getByText('Candidate-1')).toBeInTheDocument();
        });

        test('Candidate-2', () => {
            const item = items.c2;
            render(
                <ChoiceContextProvider>
                    <TestComponent item={item}/>
                </ChoiceContextProvider>
            );

            expect(screen.getByRole('choice_role')).toBeInTheDocument();
            fireEvent.click(screen.getByRole('button', {name: item.label}));
            expect(screen.getByRole('button', {name: 'Candidate-2'})).toBeInTheDocument();
        });
    });
});