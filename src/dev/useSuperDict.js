import { useDict } from '../helpers';

export const setEntryProp = (dict, key, propName) =>
    (v) => dict.set(key, {...dict.state[key], [propName]: v});

export function useSuperDict() {
    const dict = useDict();

    function createEntry(key, initialValue) {
        dict.add(key, {
            value: initialValue,
            set: setEntryProp(dict, key, 'value')
        });
        return dict.state[key];
    }

    return {createEntry, entries: dict.state};
}