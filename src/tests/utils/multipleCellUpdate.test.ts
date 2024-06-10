import parseRef from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/utils/parseRef";
import { parseTerm } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/utils/parseTerm";
import { parseMultipleCellUpdate } from  "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/utils/multipleCellUpdate";
import { parseSingleCellUpdate } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/utils/singleCellUpdate"

import { Ref } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/ref"
//Brian Daniels

describe('multipleCellUpdate', () => {

    test('parses valid input', () => {
        const input = [
            '$A1 123',
            '$B2 456',
            '$C3 789'
        ].join('\n');
        const result = parseMultipleCellUpdate(input);
        expect(result).toEqual([
            { ref: { column: 'A', row: 1 }, term: 123 },
            { ref: { column: 'B', row: 2 }, term: 456 },
            { ref: { column: 'C', row: 3 }, term: 789 }
        ]);
    });

});


