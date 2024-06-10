//all tests work

import parseRef from "../../utils/parseRef";
import { parseTerm } from "../../utils/parseTerm";
import { parseMultipleCellUpdate } from  "../../utils/multipleCellUpdate";
import { parseSingleCellUpdate } from "../../utils/singleCellUpdate"

import { Ref } from "../../classes/ref"
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


