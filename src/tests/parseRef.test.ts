
import {parseRef} from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/utils/parseRef"

describe('parseRef', () => {
    test('parses A correctly', () => { expect(parseRef('$A1')).toEqual({dollar: '$', col: 'A', row: 1});
});

    test('parses column AB correctly', () => { expect(parseRef('$AB1')).toEqual({dollar: '$', col: 'AB', row: 1});

});

    test('throws an error for invalid reference', () => { expect(() => parseRef('A1')).toThrow('Invalid reference: A1');
});

    test('throws an error for missing dollar sign', () => { expect(() => parseRef('A1')).toThrow('Invalid reference: A1');
});

    test('throws an error for missing row', () => { expect(() => parseRef('$A')).toThrow('Invalid reference: $A');
});
    test('throws an error for missing column', () => { expect(() => parseRef('$1')).toThrow('Invalid reference: $1');
});

    test('parses corretly', () => { expect(parseRef('$Ca10')).toEqual({dollar: '$', col: 'CA', row: 10});
});

});