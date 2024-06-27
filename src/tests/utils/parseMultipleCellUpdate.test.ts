//all tests work

import { multipleCellUpdate } from  "../../utils/multipleCellUpdate";



describe('parse multipleCellUpdate', () => {

    test('parses valid input', () => {
        const input = [
            '$A1 123',
            '$B2 456',
            '$C3 789'
        ].join('\n');
        const result = multipleCellUpdate(input);
        expect(result).toEqual([
            { ref: { column: 'A', row: 1 }, term: 123 },
            { ref: { column: 'B', row: 2 }, term: 456 },
            { ref: { column: 'C', row: 3 }, term: 789 }
        ]);
    });

});


