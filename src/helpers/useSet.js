import { useState } from 'react';

export function useSet(initialValues) {
    const container = {};
    const [collection, setCollection] = useState(new Set(initialValues));

    container.all = collection;

    /**
     * @param newMember
     * @returns {Set}
     */
    container.add = function (newMember) {
        let newSet;
        setCollection(currentSet => {
            newSet = new Set(currentSet);
            newSet.add(newMember);
            return newSet;
        });
        return newSet;
    }

    /**
     * @param member
     * @returns {Set}
     */
    container.del = function (member) {
        let newSet;
        setCollection(currentSet => {
            newSet = new Set(currentSet);
            newSet.delete(member)
            return newSet;
        });
        return newSet;
    }

    /**
     * @param {Array|Set=} arg - Collection of elements.
     * @param {function} arg - Callback that returns a collection of elements based on current Set.
     * @returns {Set}
     */
    container.new = function (arg) {
        let newSet;
        if (typeof arg === 'function') {
            setCollection(currentSet => {
                newSet = new Set(arg(currentSet));
                return newSet;
            });
        } else {
            newSet = new Set(arg);
            setCollection(newSet);
        }
        return newSet;
    }

    /**
     * @param member
     * @returns {boolean}
     */
    container.has = function (member) {
        return  collection.has(member);
    }

    return container;
}
