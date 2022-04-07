import { useInterval } from './useInterval';

const LOAD_CHANGED_ITEMS_INTERVAL = 60_000;// milliseconds

export function useLoading(storage, entityName) {

    useInterval(() => {
        storage.loadChangedItems(entityName, onSuccess);
    }, LOAD_CHANGED_ITEMS_INTERVAL);

    function onSuccess() {
    }

}