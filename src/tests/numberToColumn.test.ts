
import { numberToColumnLabel } from '../utils/numberToColumnLabel';

describe('numberToColumnLabel', () => {
    test('1 to A', () => {
        expect(numberToColumnLabel(1)).toBe('A');
    });

    test('26 to Z', () => {
        expect(numberToColumnLabel(26)).toBe('Z');
    });

    test('27 to AA', () => {
        expect(numberToColumnLabel(27)).toBe('AA');
    });

    test('52 to AZ', () => {
        expect(numberToColumnLabel(52)).toBe('AZ');
    });

    test('53 to BA', () => {
        expect(numberToColumnLabel(53)).toBe('BA');
    });

    test('702 to ZZ', () => {
        expect(numberToColumnLabel(702)).toBe('ZZ');
    });

    test('703 to AAA', () => {
        expect(numberToColumnLabel(703)).toBe('AAA');
    });

    test('18278 to ZZZ', () => {
        expect(numberToColumnLabel(18278)).toBe('ZZZ');
    });
});