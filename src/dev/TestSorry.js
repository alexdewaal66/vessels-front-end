import { Sorry } from './Sorry';
import { useCounter } from './useCounter';

export function TestSorry() {
    const counter = useCounter(TestSorry.name, '', 1);
    return <Sorry context={TestSorry.name} counter={counter}
    />
}