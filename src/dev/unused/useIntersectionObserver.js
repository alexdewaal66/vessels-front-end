import { useState, useRef } from 'react';
import { logv, pathMkr, rootMkr } from '../index';
import { useConditionalEffect } from '../../helpers/customHooks';
import { useStaticObject } from './useStaticObject';

const RANGE = 20;

const directions = {unknown: 'unknown', up: 'up', down: 'down'};

export function useIntersectionObserver(length, centeredIndex = 0) {
    const logRoot = rootMkr('useIntersectionObserver');

    const rootRef = useRef(null);

    const iso = useStaticObject({
        observer: null,
        indexes: new Map(),
        elements: new Map(),
        values: new Map(),
        setters: new Map(),
        first: centeredIndex - RANGE,
        last: centeredIndex + RANGE - 1,
        direction: directions.unknown,
        oldPosition: 0, // rootRef.current.scrollTop,
    });

    const [isObserverReady, setIsObserverReady] = useState(false);

    function isInRange(index) {
        return index >= iso.first && index <= iso.last;
    }

    function isAtBeginOrEnd(index) {
        return index < RANGE || index >= length - RANGE;
    }

    function isToBeObserved(index) {
        return isAtBeginOrEnd(index) || isInRange(index);
    }

    function registerElement(index, element, isVisible, setIsVisible) {
        const logPath = pathMkr(logRoot, registerElement);
        if (typeof setIsVisible !== 'function') {
            logv(logPath, {index}, '❌❌❌❌');
        }
        iso.indexes.set(element, index);
        iso.elements.set(index, element);
        iso.setters.set(index, setIsVisible);
        if (isToBeObserved(index)) {
            iso.observer.observe(element);
        }
    }

    function unregisterElement(element) {
        if (iso.indexes.has(element)) {
            const index = iso.indexes.get(element)
            iso.observer.unobserve(element);
            iso.values.delete(index);
            iso.setters.delete(index);
            iso.indexes.delete(element);
        }
    }

    function getScrollDirection() {
        const newPosition = rootRef.current.scrollTop;
        if (newPosition === iso.oldPosition)
            return iso.direction;
        iso.direction = directions.up;
        if (newPosition > iso.oldPosition)
            iso.direction = directions.down;
        iso.oldPosition = newPosition;
        return iso.direction;
    }

    function observe(index) {
        const logPath = pathMkr(logRoot, observe)
        if (isAtBeginOrEnd(index)) return; // always observed
        if (!iso.elements.has(index)) logv(logPath, {index});
        iso.observer.observe(iso.elements.get(index));
    }

    function unobserve(index) {
        const logPath = pathMkr(logRoot, unobserve)
        if (isAtBeginOrEnd(index)) return;// always observed
        if (!iso.elements.has(index)) logv(logPath, {index});
        iso.observer.unobserve(iso.elements.get(index));
    }

    function intersectionTransitionHandler(entries) {
        // const logPath = pathMkr(logRoot, intersectionTransitionHandler);
        // logv(logPath, {indexes, values, setters});
        let newFirst = iso.first, newLast = iso.last;
        const isScrollingUp = getScrollDirection() === directions.up;
        entries.forEach(entry => {
            const {isIntersecting, target} = entry;
            const index = iso.indexes.get(target);
            const setIsVisible = iso.setters.get(index);
            iso.values.set(index, isIntersecting);
            setIsVisible(isIntersecting);
            // logv(null, {isIntersecting, index});
            if (isIntersecting) {
                if (isScrollingUp) {// appear scrolling up
                    observe(index - RANGE);
                    if (index < newFirst) newFirst = index;
                } else {// appear scrolling down
                    observe(index + RANGE);
                    if (index > newLast) newLast = index;
                }
            } else {
                if (isScrollingUp) {// disappear scrolling up
                    unobserve(index + RANGE);
                    if (index <= newLast) newLast = index - 1;
                } else {// disappear scrolling down
                    observe(index - RANGE);
                    if (index >= newFirst) newFirst = index + 1;
                }
            }
        });
        iso.first = newFirst;
        iso.last = newLast;
        // logv(logPath, {iso: iso[null]}, '==============');
    }


    useConditionalEffect(() => {
        // const logPath = pathMkr(logRoot, 'useConditionalEffect');
        // logv(logPath, {observer: iso.observer, rootRef});
        iso.observer = new IntersectionObserver(
            intersectionTransitionHandler,
            {
                root: rootRef.current,
                rootMargin: '0px 0px 0px 0px'
            }
        );
        setIsObserverReady(true);
        return () => {
            iso.observer.disconnect();
        }
    }, true, [rootRef.current]);


    return {
        isObserverReady,
        rootRef,
        registerElement,
        unregisterElement,
        iso,
    };
}
