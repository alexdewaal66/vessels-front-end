import { exportedForTesting } from '../../helpers/entityTypes';

const {expansions, expandValidation, transformEntries, expandAllValidations} = exportedForTesting

describe('validation support functions', () => {
    describe('expansions', () => {
        test('dot notation', () => {
            const actual = expansions.max(10);
            expect(actual).toEqual({value: 10, message: 'niet groter dan 10'});
        });
        test.each([
            ['required', null, {value: null, message: 'verplicht veld'}],
            ['maxLength', 30, {value: 30, message: 'maximaal 30 karakters'}],
            ['minLength', 10, {value: 10, message: 'minimaal 10 karakters'}],
            ['max', 4321, {value: 4321, message: 'niet groter dan 4321'}],
            ['min', 1234, {value: 1234, message: 'niet kleiner dan 1234'}]
        ])('criterion=%s', (criterion, value, expected) => {
            const actual = expansions[criterion](value);
            expect(actual).toEqual(expected);
        });
    });

    describe('expandValidation', () => {
        test.each([
            [['required', null], ['required', {value: null, message: 'verplicht veld'}]],
            [['required', {a: 1, b: 'bb'}], ['required', {a: 1, b: 'bb'}]],
            [['maxLength', 30], ['maxLength', {value: 30, message: 'maximaal 30 karakters'}]],
            [['min', 1234], ['min', {value: 1234, message: 'niet kleiner dan 1234'}]]
        ])('unexpanded=%o', (unexpanded, expected) => {
            const actual = expandValidation(unexpanded);
            expect(actual).toEqual(expected);
        });
    });

    describe('transformEntries', () => {
        function swapElements([a, b]) {
            return [b, a];
        }

        const testcase = {a: 1, b: 2, c: 3};
        const actual = transformEntries(testcase, swapElements);
        expect(actual).toEqual({'1': 'a', '2': 'b', '3': 'c'});
    });

    describe('expandAllValidations', () => {
        test('no validation', () => {
            const testcase = {a: 1, b: 2, c: 3};
            const copy = JSON.parse(JSON.stringify(testcase));
            expandAllValidations(testcase);
            expect(testcase).toEqual(copy);
        });

        test('with unexpanded validation', () => {
            const testcase = {a: 1, b: 2, c: 3, validation: {min: 314159}};
            const expected = {
                a: 1, b: 2, c: 3,
                validation: {min: {value: 314159, message: 'niet kleiner dan 314159'}}
            };
            expandAllValidations(testcase);
            expect(testcase).toEqual(expected);
        });
    });
});