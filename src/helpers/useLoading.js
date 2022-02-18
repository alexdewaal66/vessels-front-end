import { useMountEffect } from './customHooks';


export function useLoading(storage, metadata) {
    const entityName = metadata.name;

    useMountEffect(() => storage.loadAllItems(entityName, onSuccess));

    function onSuccess() {
    }

}