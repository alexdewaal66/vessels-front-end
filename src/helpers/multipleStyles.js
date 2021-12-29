/**
 * @param {string} cssClasses
 * @returns {string}
 */
export function cx(...cssClasses) {
    return cssClasses.join(' ');
}
/*
usage:

<someTag className={cx(moduleX.classA, moduleY.classB)} />

 */