//all tests work

import { parseRef } from '../../utils/parseRef';

describe('parseRef', () => {
    test('parses A correctly', () => { expect(parseRef('$A1')).toEqual({column: 'A', row: 1});
});

    test('parses column AB correctly', () => { expect(parseRef('$AB1')).toEqual({column: 'AB', row: 1});

});

    test('throws an error for invalid reference', () => { expect(() => parseRef('A1')).toThrow('Invalid ref: A1');
});

    test('throws an error for missing dollar sign', () => { expect(() => parseRef('A1')).toThrow('Invalid ref: A1');
});

    test('throws an error for missing row', () => { expect(() => parseRef('$A')).toThrow('Invalid ref: $A');
});
    test('throws an error for missing column', () => { expect(() => parseRef('$1')).toThrow('Invalid ref: $1');
});

    test('parses corretly', () => { expect(parseRef('$Ca10')).toEqual({ column: 'CA', row: 10});
});

});