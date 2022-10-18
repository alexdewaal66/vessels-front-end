import { useState } from 'react';

export function useImmutableSet(initialValues) {
    const [collection, setCollection] = useState(new Set(initialValues));

    // container.all = collection;

    // /**
    //  * @param newMember
    //  * @returns {Set}
    //  */
    // container.add = function (newMember) {
    //     let newSet;
    //     setCollection(currentSet => {
    //         newSet = new Set(currentSet);
    //         newSet.add(newMember);
    //         return newSet;
    //     });
    //     return newSet;
    // }

    // /**
    //  * @param member
    //  * @returns {Set}
    //  */
    // container.del = function (member) {
    //     let newSet;
    //     setCollection(currentSet => {
    //         newSet = new Set(currentSet);
    //         newSet.delete(member)
    //         return newSet;
    //     });
    //     return newSet;
    // }

    // /**
    //  * @param member
    //  * @returns {Set}
    //  */
    // container.toggle = function (member) {
    //     let newSet;
    //     setCollection(currentSet => {
    //         newSet = new Set(currentSet);
    //         if (newSet.has(member)) {
    //             newSet.delete(member);
    //         } else {
    //             newSet.add(member);
    //         }
    //         return newSet;
    //     });
    //     return newSet;
    // }

    // /**
    //  * @param {Array|Set=} arg - Collection of elements.
    //  * @param {function} arg - Callback that returns a collection of elements based on current Set.
    //  * @returns {Set}
    //  */
    // container.new = function (arg) {
    //     let newSet;
    //     if (typeof arg === 'function') {
    //         setCollection(currentSet => {
    //             newSet = new Set(arg(currentSet));
    //             return newSet;
    //         });
    //     } else {
    //         newSet = new Set(arg);
    //         setCollection(newSet);
    //     }
    //     return newSet;
    // }

    // /**
    //  * @param member
    //  * @returns {boolean}
    //  */
    // container.has = function (member) {
    //     return  collection.has(member);
    // }


    return {
        get all() {
            return collection
        },

        get size() {
            return collection.size
        },

        /**
         * Adds supplied object to the set if not already present
         *
         * @param newMember
         * @returns {Set}
         */
        add(newMember) {
            let newSet;
            setCollection(currentSet => {
                newSet = new Set(currentSet);
                newSet.add(newMember);
                return newSet;
            });
            return newSet;
        },

        /**
         * Removes supplied object from the set if present
         *
         * @param member
         * @returns {Set}
         */
        del(member) {
            let newSet;
            setCollection(currentSet => {
                newSet = new Set(currentSet);
                newSet.delete(member)
                return newSet;
            });
            return newSet;
        },

        /**
         * Adds supplied object to the set if absent
         * but removes it if present
         *
         * @param member
         * @returns {Set}
         */
        toggle(member) {
            let newSet;
            setCollection(currentSet => {
                newSet = new Set(currentSet);
                if (newSet.has(member)) {
                    newSet.delete(member);
                } else {
                    newSet.add(member);
                }
                return newSet;
            });
            return newSet;
        },

        /**
         * Creates new Set object from supplied object
         * directly unless it is a function, which then
         * transforms current set into a new one
         *
         * @param arg
         * @returns {Set}
         */
        new(arg) {
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
        },

        /**
         * @param member
         * @returns {boolean}
         */
        has(member) {
            return collection.has(member);
        },
    };
}
