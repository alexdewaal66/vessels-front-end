import { useState } from 'react';
import { validities } from '../../helpers/useStorage';
import { useConditionalEffect } from '../../helpers/customHooks';
// import { logv, pathMkr, rootMkr } from '../dev/log';

const blockSize = 10000;

export function useBGLoading(storage, entityType) {
    const entityName = entityType.name;
    // const logRoot = rootMkr(useBGLoading, entityName);
    const {store} = storage;
    const [loadCounter, setLoadCounter] = useState(0);
    const [pendingBlocks, setPendingBlocks] = useState([]);
    const tree = store[entityName];

    function setSingleBlock(index, value) {
        // const logPath = pathMkr(logRoot, setSingleBlock, '↓↓');
        // logv(logPath, {index, value, pendingBlocks})
        setPendingBlocks(currentBlocks =>
            [...currentBlocks.slice(0, index), value, ...currentBlocks.slice(index + 1)])
    }

    function loadUnloadedItems() {
        // const logPath = pathMkr(logRoot, loadUnloadedItems);
        // logv(logPath, {loadCounter, pendingBlocks});

        if (pendingBlocks.length === 0) {
            const blockCount = 1 + Math.ceil(Object.keys(tree.state).length / blockSize);
            setPendingBlocks(Array(blockCount).fill(false));
            return;
        }

        function unloadedFilter(key, index) {
            // const innerLogPath = pathMkr(logPath, unloadedFilter);
            const hasOnlyId = tree.state[key].validity === validities.id;
            const blockNr = Math.floor(index / blockSize);
            const isBlockPending = pendingBlocks[blockNr];
            return hasOnlyId && !isBlockPending;
        }

        const keys = Object.keys(tree.state);
        // logv(null, {entries, pendingBlocks});
        const first = keys.findIndex(unloadedFilter);
        // logv(null, {first});
        if (first === -1) return;

        const unloaded = keys.slice(first, first + blockSize).filter(unloadedFilter);
        // logv(null, {unloaded});
        if (unloaded.length > 0) {
            const endIndex = Math.min(blockSize, unloaded.length);
            const unloadedIds = unloaded.slice(0, endIndex);//.map(e => +e);
            setLoadCounter(c => c + 1);
            // set the block to be loaded as 'pending'
            const currentBlockNr = Math.floor(first / blockSize);
            // logv(null, {first, 'entries[first]': entries[first], currentBlockNr});
            setSingleBlock(currentBlockNr, true);
            storage.loadItemsByIds(
                entityName, unloadedIds,
                () => {
                    setLoadCounter(c => c - 1);
                    setSingleBlock(currentBlockNr, false);
                }
            );
        }
    }

    //
    // function recursiveLoadUnloadedItems(loadCounter, pendingBlocks, depth) {
    //     const logPath = pathMkr(logRoot, recursiveLoadUnloadedItems);
    //     logv(logPath, {loadCounter, pendingBlocks, depth});
    //
    //
    // }
    //
    // function callRecursiveLoadUnloadedItems() {
    //     const blockCount = 1 + Math.ceil(Object.keys(tree.state).length / blockSize);
    //     const pendingBlocks = Array(blockCount).fill(false);
    //     recursiveLoadUnloadedItems(0, pendingBlocks, 0);
    // }
    //

    // logv(logRoot, {loadCounter, pendingBlocks});

    useConditionalEffect(
        loadUnloadedItems,
        (loadCounter < 1),
        [loadCounter, pendingBlocks]
    );
}
