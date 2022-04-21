import { useInterval } from './useInterval';

const LOAD_CHANGED_ITEMS_INTERVAL = 5 * 60_000;// milliseconds

export function useLoading(storage, entityName) {

    useInterval(() => {
        storage.loadChangedItems(entityName);
    }, LOAD_CHANGED_ITEMS_INTERVAL);

}
