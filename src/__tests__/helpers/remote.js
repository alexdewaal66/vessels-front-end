import { addJwtToHeaders, persistentVars } from '../../helpers';

describe('remote helper functions', () => {

    describe('addJwtToHeaders()', () => {
        const jwtValue = 'NOT A REAL JSON WEBTOKEN';
        const headers = {'non-functional key': 'equally useless value'};

        describe('no jwt in localStorage', () => {
            test('no headers argument', () => {
                localStorage.clear();
                const actual = addJwtToHeaders();
                expect(actual).toStrictEqual({});
            });
            test('with headers argument', () => {
                localStorage.clear();
                const actual = addJwtToHeaders(headers);
                expect(actual).toStrictEqual(headers);
            });

        });

        describe('with jwt in localStorage', () => {
            test('no headers argument', () => {
                localStorage.clear();
                localStorage.setItem(persistentVars.JWT, jwtValue)
                const actual = addJwtToHeaders();
                const expected = {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwtValue,
                };
                expect(actual).toStrictEqual(expected);
            });
            test('with headers argument', () => {
                localStorage.clear();
                localStorage.setItem(persistentVars.JWT, jwtValue)
                const actual = addJwtToHeaders(headers);
                const expected = {
                    'non-functional key': 'equally useless value',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwtValue,
                };
                expect(actual).toStrictEqual(expected);
            });

        });
    });

});