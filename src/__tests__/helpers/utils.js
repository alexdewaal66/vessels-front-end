import { formatTime, loCaseCompare, now } from '../../helpers';

test('timestamp to UU:MM:SS format', () => {
    const timestamp = 1640995200000
    const actual = formatTime(timestamp);
    expect(actual).toBe('01:00:00');
});


test('compares numbers or strings case independent', () => {
    const testData = [
        // [p, q, expected]
        [100, 101, -1],
        [100, 100, 0],
        [101, 100, 1],
        ['aaa', 'bbb', -1],
        ['aaa', 'BBB', -1],
        ['AAA', 'bbb', -1],
        ['AAA', 'BBB', -1],
        ['aaa', 'aaa', 0],
        ['AAA', 'aaa', 0],
        ['aaa', 'AAA', 0],
        ['AAA', 'AAA', 0],
        ['bbb', 'aaa', 1],
        ['BBB', 'aaa', 1],
        ['bbb', 'AAA', 1],
        ['BBB', 'AAA', 1],
    ];
    testData.forEach(([p, q, expected]) => {
        const actual = loCaseCompare(p, q);
        expect(actual).toBe(expected);
    });
});

test('now() output format is "(HH:MM:SS.sss)"', () => {
    const actual = now();
    const firstChar = actual.charAt(0);
    const lastChar = actual.charAt(actual.length - 1);
    const [hh, mm, ss_ms] = actual.slice(1, -1).split(':');
    const [ss, ms] = ss_ms.split('.');
    expect(firstChar).toBe('(');
    expect(lastChar).toBe(')');
    expect(hh.length).toBe(2);
    expect(mm.length).toBe(2);
    expect(ss.length).toBe(2);
    expect(ms.length).toBe(3);
});

