import { transform } from '../../helpers';


test('unLocode functionClassifier transforms into description', () => {
    const actual = transform('unLocode', 'functionClassifier', '1-345---');
    expect(actual).toStrictEqual({
        '1': 'Haven',
        '3': 'Wegterminal',
        '4': 'Luchthaven',
        '5': 'Postkantoor'
    });
});

test('unLocode status transforms into description', () => {
    const actual = transform('unLocode', 'status', 'AA');
    expect(actual).toStrictEqual({
        AA: 'Approved by competent national government agency'
    });
});
