import { useState } from 'react';
import { validities } from './useStorage';
import { useConditionalEffect } from './customHooks';

export function useBGLoading(storage, metadata) {
    const entityName = metadata.name;
    const {store, loadItemsByIds} = storage;
    const [loadCounter, setLoadCounter] = useState(0);
    const [pendingBlocks, setPendingBlocks] = useState([]);

    function setSingleBlock(index, value) {
        setPendingBlocks(currentBlocks =>
            [...currentBlocks.slice(0, index), value, ...currentBlocks.slice(index + 1)])
    }

    function loadUnloadedItems() {
        const blockSize = 5000;
        const tree = store[entityName];

        if (pendingBlocks.length === 0) {
            const blockCount = 1 + Math.ceil(Object.entries(tree.state).length / blockSize);
            setPendingBlocks(Array(blockCount).fill(false));
            return;
        }

        const unloadedFilter = (entry, index) => {
            const hasOnlyId = entry[1].validity === validities.id;
            const blockNr = Math.floor(index / blockSize);
            const isBlockPending = pendingBlocks[blockNr];
            return hasOnlyId && !isBlockPending;
        };

        const entries = Object.entries(tree.state);
        // console.log(`SummaryList » loadUnloadedItems()\n\tentries=`, entries, `\n\tpendingBlocks=`, pendingBlocks);
        const first = entries.findIndex(unloadedFilter);
        // console.log(`SummaryList » loadUnloadedItems()\nfirst=`, first);
        if (first === -1) return;

        const unloaded = entries.slice(first, first + blockSize).filter(unloadedFilter);
        // console.log(`SummaryList » loadUnloadedItems()\nunloaded=`, unloaded);
        if (unloaded.length > 0) {
            const endIndex = Math.min(blockSize, unloaded.length);
            const unloadedIds = unloaded.slice(0, endIndex).map(e => e[1].item.id);
            // console.log(`SummaryList » loadUnloadedItems()\n\tunloadedIds=`, unloadedIds);
            setLoadCounter(c => c + 1);
            // set the block to be loaded as 'pending'
            const currentBlockNr = Math.floor(first / blockSize);
            // console.log(`entries[first]=`, entries[first], `currentBlockNr=`, currentBlockNr);
            setSingleBlock(currentBlockNr, true);
            loadItemsByIds(entityName, unloadedIds,
                () => {
                    setLoadCounter(c => c - 1);
                    setSingleBlock(currentBlockNr, false);
                }
            );
        }
    }

    // console.log(`SummaryList \nloadCounter=`, loadCounter, `\npendingBlocks=`, pendingBlocks);

    useConditionalEffect(
        loadUnloadedItems,
        (loadCounter < 3),
        [loadCounter, pendingBlocks]
    );
}
