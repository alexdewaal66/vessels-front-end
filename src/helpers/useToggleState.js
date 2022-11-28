import { useState } from 'react';

export function useToggleState(initialValue) {
    const [value, setValue] = useState(initialValue);

    function toggle() {
        setValue(value => !value);
    }

    return [value, toggle];
}
