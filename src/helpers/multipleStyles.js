export function cx(...classes) {
    return classes.join(' ');
}
/*
usage:

<someTag className={cx(moduleX.classA, moduleY.classB)} />

 */