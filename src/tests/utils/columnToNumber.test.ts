//all tests work

//Brian Daniels
import { columnToNumber } from '../../utils/columnToNumber';

describe('columnToNumber', () => {
    test('A to 1', () => {
        expect(columnToNumber('A')).toBe(1);
    });

    test('Z to 26', () => {
        expect(columnToNumber('Z')).toBe(26);
    });

    test('AA to 27', () => {
        expect(columnToNumber('AA')).toBe(27);
    });

    test('AZ to 52', () => {
        expect(columnToNumber('AZ')).toBe(52);
    });

    test('BA to 53', () => {
        expect(columnToNumber('BA')).toBe(53);
    });

    test('ZZ to 702', () => {
        expect(columnToNumber('ZZ')).toBe(702);
    });

    test('AAA to 703', () => {
        expect(columnToNumber('AAA')).toBe(703);
    });

    test('ZZZ to 18278', () => {
        expect(columnToNumber('ZZZ')).toBe(18278);
    });
});
