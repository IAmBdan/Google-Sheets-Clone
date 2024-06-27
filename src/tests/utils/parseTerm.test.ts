//all tests work

import { parseTerm } from  "../../utils/parseTerm";

describe('parseTerm', () => {
    test('parses integer numbers', () => {
        expect(parseTerm('123')).toBe(123);
        expect(parseTerm('-123')).toBe(-123);
    });

    test('parses floating-point numbers', () => {
        expect(parseTerm('123.45')).toBe(123.45);
        expect(parseTerm('-123.45')).toBe(-123.45);
    });

    test('parses double-quote-delimited strings', () => {
        expect(parseTerm('"Hello World"')).toBe('Hello World');
        expect(parseTerm('"Escaped \\"quotes\\""')).toBe('Escaped "quotes"');
    });

    test('parses formulas', () => {
        expect(parseTerm('=SUM(A1:B2)')).toEqual({ formula: 'SUM(A1:B2)' });
        expect(parseTerm('=A1+B1')).toEqual({ formula: 'A1+B1' });
    });

    test('throws error for invalid terms', () => {
        expect(() => parseTerm('Invalid')).toThrow('Invalid term: Invalid');
        expect(() => parseTerm('')).toThrow('Invalid term: ');
        expect(() => parseTerm('123abc')).toThrow('Invalid term: 123abc');
    });
});
