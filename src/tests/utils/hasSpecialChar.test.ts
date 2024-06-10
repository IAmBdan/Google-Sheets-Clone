//Brian Daniels
import { hasSpecialChar } from '../../utils/hasSpecialChar';

describe('hasSpecialCharacters', () => {
    test('empty string', () => {
        expect(hasSpecialChar('')).toBe(false);
    });

    test('no special characters', () => {
        expect(hasSpecialChar('abcdef')).toBe(false);
    });

    test('special characters', () => {
        expect(hasSpecialChar('abc!@#def')).toBe(true);
    });

    test('special characters with spaces', () => {
        expect(hasSpecialChar('abc!@# def')).toBe(true);
    });

    test('special characters with numbers', () => {
        expect(hasSpecialChar('abc!@# def 123')).toBe(true);
    });

    test('special characters with numbers and special characters', () => {
        expect(hasSpecialChar('abc!@# def 123 !@#')).toBe(true);
    });
});
