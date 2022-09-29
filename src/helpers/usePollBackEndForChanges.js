import { useInterval } from './useInterval';
import { sessionConfig } from './utils';
import { logv } from '../dev/log';

export function usePollBackEndForChanges(storage, entityName) {

    const MINUTE = 60_000;// milliseconds
    const speedUp = sessionConfig.shortRefresh.value ? 10 : 1;
    const pollingInterval = 2 * MINUTE / speedUp;

    useInterval(() => {
        // logv(usePollBackEndForChanges.name, {speedUp}, '⏲');
        storage.loadChangedItems(entityName);
    }, pollingInterval);

}
