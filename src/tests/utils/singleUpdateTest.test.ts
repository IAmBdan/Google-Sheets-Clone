//all tests work

import { parseSingleCellUpdate } from "../../utils/singleCellUpdate"
import parseRef from "../../utils/parseRef"
import { parseTerm } from "../../utils/parseTerm"

//Brian Daniels
jest.mock("../../utils/parseRef");
jest.mock("../../utils/parseTerm");

describe('singleCellUpdate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('parses valid input line with integer term', () => {
        (parseRef as jest.Mock).mockReturnValue({ column: 'A', row: 1 });
        (parseTerm as jest.Mock).mockReturnValue(123);

        const inputLine = '$A1 123';
        const result = parseSingleCellUpdate(inputLine);

        expect(parseRef).toHaveBeenCalledWith('$A1');
        expect(parseTerm).toHaveBeenCalledWith('123');
        expect(result).toEqual({ ref: { column: 'A', row: 1 }, term: 123 });
    });

    test('parses valid input line with floating-point term', () => {
        (parseRef as jest.Mock).mockReturnValue({ column: 'A', row: 1 });
        (parseTerm as jest.Mock).mockReturnValue(123.45);

        const inputLine = '$A1 123.45';
        const result = parseSingleCellUpdate(inputLine);

        expect(parseRef).toHaveBeenCalledWith('$A1');
        expect(parseTerm).toHaveBeenCalledWith('123.45');
        expect(result).toEqual({ ref: { column: 'A', row: 1 }, term: 123.45 });
    });

    test('parses valid input line with string term', () => {
        (parseRef as jest.Mock).mockReturnValue({ column: 'A', row: 1 });
        (parseTerm as jest.Mock).mockReturnValue('Hello World');

        const inputLine = '$A1 "Hello World"';
        const result = parseSingleCellUpdate(inputLine);

        expect(parseRef).toHaveBeenCalledWith('$A1');
        expect(parseTerm).toHaveBeenCalledWith('"Hello World"');
        expect(result).toEqual({ ref: { column: 'A', row: 1 }, term: 'Hello World' });
    });

    test('parses valid input line with formula term', () => {
        (parseRef as jest.Mock).mockReturnValue({ column: 'A', row: 1 });
        (parseTerm as jest.Mock).mockReturnValue({ formula: 'SUM(A1:B2)' });

        const inputLine = '$A1 =SUM(A1:B2)';
        const result = parseSingleCellUpdate(inputLine);

        expect(parseRef).toHaveBeenCalledWith('$A1');
        expect(parseTerm).toHaveBeenCalledWith('=SUM(A1:B2)');
        expect(result).toEqual({ ref: { column: 'A', row: 1 }, term: { formula: 'SUM(A1:B2)' } });
    });

    test('throws error if reference string is missing', () => {
        const inputLine = ' 123';

        expect(() => parseSingleCellUpdate(inputLine)).toThrow('Invalid input line:  123');
    });

    test('throws error if term string is invalid', () => {
        (parseRef as jest.Mock).mockReturnValue({ column: 'A', row: 1 });
        (parseTerm as jest.Mock).mockImplementation(() => { throw new Error('Invalid term: 123abc'); });

        const inputLine = '$A1 123abc';

        expect(() => parseSingleCellUpdate(inputLine)).toThrow('Invalid term: 123abc');
    });

    test('throws error if term string is missing', () => {
        (parseRef as jest.Mock).mockReturnValue({ column: 'A', row: 1 });
        (parseTerm as jest.Mock).mockImplementation(() => { throw new Error('Invalid term: '); });

        const inputLine = '$A1 ';

        expect(() => parseSingleCellUpdate(inputLine)).toThrow('Invalid input line: $A1 ');
    });
});
