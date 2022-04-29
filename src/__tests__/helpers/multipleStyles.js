import { cx } from '../../helpers';

test('css classname concatenation', () => {
   const actual = cx('aa', 'bb', 'cc');
   expect(actual).toBe('aa bb cc');
});
