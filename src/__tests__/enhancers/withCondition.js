import { render, screen } from '@testing-library/react';
import { withCondition } from '../../enhancers/withCondition';

function BaseComponent({children}) {
    return <>
        before
        {children}
        after
    </>
}

describe('withCondition(BaseComponent) returns componentName that renders conditionally', () => {

    test('false condition, html element', () => {
        const ConditionalComponent = withCondition('p');
        render(<ConditionalComponent condition={false}>some_literal_text</ConditionalComponent>);
        const element = screen.queryByText(/some_literal_text/i);
        expect(element).not.toBeInTheDocument();
    });

    test('true condition, html element', () => {
        const ConditionalComponent = withCondition('p');
        render(<ConditionalComponent condition={true}>some_literal_text</ConditionalComponent>);
        const element = screen.queryByText(/some_literal_text/i);
        expect(element).toBeInTheDocument();
    });

    test('false condition', () => {
        const ConditionalComponent = withCondition(BaseComponent);
        render(<ConditionalComponent condition={false}>some_literal_text</ConditionalComponent>);
        const element = screen.queryByText(/some_literal_text/i);
        expect(element).not.toBeInTheDocument();
    });

    test('true condition', () => {
        const ConditionalComponent = withCondition(BaseComponent);
        render(<ConditionalComponent condition={true}>some_literal_text</ConditionalComponent>);
        const element = screen.queryByText(/some_literal_text/i);
        expect(element).toBeInTheDocument();
    });

});

