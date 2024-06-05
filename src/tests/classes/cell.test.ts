//test all cell methods


import { Cell } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/cell"
import  { Ref } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/ref"

describe('Cell', () => {
    test('Cell w number value', () => {
        const cell = new Cell(15321);
        expect(cell.getValue()).toBe(15321);
    });

    test('Cell w string value', () => {
        const cell = new Cell('hello');
        expect(cell.getValue()).toBe('hello');
    });

    test('Cell w formula value', () => {
        const cell = new Cell({ formula: '=$A1' });
        expect(cell.getValue()).toEqual({ formula: '=$A1' });
    });

    test('Cell w null value', () => {
        const cell = new Cell(null);
        expect(cell.getValue()).toBe(null);
    });
    
    test('cell with ref', () => {
        const refA1 = new Ref('$A1');
        const cell = new Cell(5, refA1);
        expect(cell.getRefString()).toBe('$A1');
        expect(cell.getRef()).toEqual(refA1); 
    });

    test('cell with ref as string', () => {
        const cell = new Cell(5, '$A1');
        expect(cell.getRefString()).toBe('$A1');
        expect(cell.getRef()).toEqual(new Ref('$A1'));
    });

    test('getValue number', () => {
        const cell = new Cell(5);
        expect(cell.getValue()).toBe(5);
    });

    test('getValue string', () => {
        const cell = new Cell('hello');
        expect(cell.getValue()).toBe('hello');
    });

    test('getValue formula', () => {
        const cell = new Cell({ formula: '=$A1' });
        expect(cell.getValue()).toEqual({ formula: '=$A1' });
    });

    test('getValue null', () => { 
        const cell = new Cell(null);
        expect(cell.getValue()).toBe(null);
    });

    test('setValue number', () => {
        const cell = new Cell(5);
        expect(cell.getValue()).toBe(5);
        cell.setValue(10);
        expect(cell.getValue()).toBe(10);
    });

    test('setValue string', () => {
        const cell = new Cell('hello');
        expect(cell.getValue()).toBe('hello');
        cell.setValue('world');
        expect(cell.getValue()).toBe('world');
    });

    test('setValue formula', () => {
        const cell = new Cell({ formula: '=$A1' });
        expect(cell.getValue()).toEqual({ formula: '=$A1' });
        cell.setValue({ formula: '=$B1' });
        expect(cell.getValue()).toEqual({ formula: '=$B1' });
    });

    test('setValue null', () => {
        const cell = new Cell(5);
        expect(cell.getValue()).toBe(5);
        cell.setValue(null);
        expect(cell.getValue()).toBe(null);
    });

test ('setRef', () => {
    const cell = new Cell(5);
    const ref = new Ref('$AA11');
    cell.setRef(ref);
    expect(cell.getRef()).toEqual(ref);
    expect(cell.getRefString()).toBe('$AA11');
    expect(cell.refAsString).toBe('$AA11');
    expect(cell.ref).toEqual(ref);
});

test ('setRefAsString', () => {
    const cell = new Cell(5);
    cell.setRefAsString('$AA11');
    expect(cell.getRef()).toEqual(new Ref('$AA11'));
    expect(cell.getRefString()).toBe('$AA11');
    expect(cell.refAsString).toBe('$AA11');
    expect(cell.ref).toEqual(new Ref('$AA11'));
});

test ('getRef', () => {
    const cell = new Cell(5, '$AA11');
    expect(cell.getRef()).toEqual(new Ref('$AA11'));
});

test ('getRef with undefined ref', () => {
    const cell = new Cell(5);
    expect(() => cell.getRef()).toThrow('Ref is undefined');
});

test ('getref with new ref',  () => {
    const ref = new Ref('$AA11');
    const cell = new Cell(5, ref);
    expect(cell.getRef()).toEqual(ref);
});

test ('getRefString', () => {
    const cell = new Cell(5, '$AA11');
    expect(cell.getRefString()).toBe('$AA11');
});

test ('getRefString with new ref', () => {
    const ref = new Ref('$AA11');
    const cell = new Cell(5, ref);
    expect(cell.getRefString()).toBe('$AA11');
});

test ('getRefString with undefined ref', () => {
    const cell = new Cell(5);
    expect(() => cell.getRefString()).toThrow('Ref is undefined');
});

test ('equals with number value', () => {
    const cell = new Cell(5);
    const cell2 = new Cell(5);
    expect(cell.equals(cell2)).toBe(true);
});

test ('equals with different values', () => {
    const cell = new Cell(5);
    const cell2 = new Cell(10);
    expect(cell.equals(cell2)).toBe(false);
});

test ('equals with different types', () => {
    const cell = new Cell(5);
    const cell2 = new Cell('hello');
    expect(cell.equals(cell2)).toBe(false);
});


test ('equals with cell having ref', () => {
    const cell = new Cell(5);
    const cell2 = new Cell(5, '$A1');
    expect(cell.equals(cell2)).toBe(false);
}); 

test ('equals with cell having ref', () => {
    const cell = new Cell(5, '$A1');
    const cell2 = new Cell(5, '$A1');
    expect(cell.equals(cell2)).toBe(true);
});

test ('equals with cell having ref as string', () => {
    const cell = new Cell(5, '$A1');
    const cell2 = new Cell(5, new Ref('$A1'));
    expect(cell.equals(cell2)).toBe(true);
});

test ('equals with cell having same refs but different objects', () => {
    const ref1 = new Ref('$A1');
    const cell = new Cell(5, ref1);
    const ref2 = new Ref('$A1');
    const cell2 = new Cell(5, ref2);
    expect(cell.equals(cell2)).toBe(true);
});

test ('equals with cell having different refs', () => {
    const cell = new Cell(5, '$A1');
    const cell2 = new Cell(5, '$A2');
    expect(cell.equals(cell2)).toBe(false);
});

test ('equals with cell having same ref and diff ref as string', () => {
    const cell = new Cell(5, '$A1');
    const cell2 = new Cell(5, new Ref('$A1'));
    cell2.setRefAsString('$A3');
    expect(cell.equals(cell2)).toBe(false);
});



test (' equals with formula', () => {
    const cell = new Cell({ formula: '=$A1' });
    expect(cell.getValue()).toEqual({ formula: '=$A1' });
   
    const cell2 = new Cell({ formula: '=$A1' });
    expect(cell2.getValue()).toEqual({ formula: '=$A1' });
   
    expect(cell.equals(cell2)).toBe(true);
});

})