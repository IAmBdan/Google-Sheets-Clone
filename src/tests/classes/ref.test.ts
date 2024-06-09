//test ref and all ref methods
//Brian Daniels
import { Ref } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/ref"

describe('Ref', () => {

test ('contructor', () => {
    const ref = new Ref('$A1');
    expect(ref.column).toBe('A');
    expect(ref.row).toBe(1);
});

test ('invalid constructor', () => {
    expect(() => new Ref('A1')).toThrow('Invalid ref: A1');
    expect(() => new Ref('$A')).toThrow('Invalid ref: $A');
    expect(() => new Ref('$1')).toThrow('Invalid ref: $1');
    expect(() => new Ref('A', -2)).toThrow('Invalid row: -2, cannot be less than 1');
    expect(() => new Ref('A', 0)).toThrow('Invalid row: 0, cannot be less than 1');
    expect(() => new Ref('A', 1.1)).toThrow('Invalid row: 1.1, cannot be less than 1');
    expect(() => new Ref('A', NaN)).toThrow('Invalid row: NaN, cannot be less than 1');
    expect(() => new Ref('A', Infinity)).toThrow('Invalid row: Infinity, cannot be less than 1');
    expect(() => new Ref('A', -Infinity)).toThrow('Invalid row: -Infinity, cannot be less than 1');
    expect(() => new Ref('', 3)).toThrow('Invalid ref: \"\", 3');
    expect(() => new Ref('A', 3.1)).toThrow('Invalid row: 3.1, cannot be less than 1');
    expect(() => new Ref('#/@', 3)).toThrow('Invalid ref: \"#/@\", 3');
    expect(() => new Ref('$%^&*(', 3)).toThrow('Invalid ref: \"$%^&*(\", 3');
    expect(() => new Ref('$15')).toThrow('Invalid ref: $15');
    expect(() => new Ref('$A1A')).toThrow('Invalid ref: $A1A');
    expect(() => new Ref('$%/%A1')).toThrow('Invalid ref: $%/%A1');
    expect(() => new Ref('$A-1')).toThrow('Invalid ref: $A-1');
    expect(() => new Ref('$A0')).toThrow('Invalid row: 0, cannot be less than 1');
    expect(() => new Ref('$A1.1')).toThrow('Invalid ref: $A1.1');
    expect(() => new Ref('$ANaN')).toThrow('Invalid ref: $ANaN');
    expect(() => new Ref('$AInfinity')).toThrow('Invalid ref: $AInfinity');
    expect(() => new Ref('$A-Infinity')).toThrow('Invalid ref: $A-Infinity');
    expect(() => new Ref('$A')).toThrow('Invalid ref: $A');
    expect(() => new Ref('$A-100')).toThrow('Invalid ref: $A-100');
    expect(() => new Ref('$A#A100')).toThrow('Invalid ref: $A#A100');
    expect(() => new Ref('$%$1')).toThrow('Invalid ref: $%$1');
    expect(() => new Ref('$A!1')).toThrow('Invalid ref: $A!1');
});

test ('ref construction', () => {
    const ref = new Ref('$A1');
    expect(ref.column).toBe('A');
    expect(ref.row).toBe(1);
    const ref2 = new Ref('A', 22);
    expect(ref2.column).toBe('A');
    expect(ref2.row).toBe(22);
    const ref3 = new Ref('AB', 10);
    expect(ref3.column).toBe('AB');
    expect(ref3.row).toBe(10);
    const ref4 = new Ref('$ZZMSMSMS100001230');
    expect(ref4.column).toBe('ZZMSMSMS');
    expect(ref4.row).toBe(100001230);
});

test ('toString', () => {
    const ref = new Ref('$A1');
    expect(ref.toString()).toBe('$A1');
    const ref2 = new Ref('$AB10');
    expect(ref2.toString()).toBe('$AB10');
    const ref3 = new Ref('$A100');
    expect(ref3.toString()).toBe('$A100');
    const ref4 = new Ref('$ZZMSMSMS100001230');
    expect(ref4.toString()).toBe('$ZZMSMSMS100001230');
    const ref5 = new Ref('A', 22);
    expect(ref5.toString()).toBe('$A22');
});

test ('isEqual', () => {
    const ref = new Ref('$A1');
    const ref2 = new Ref('$A1');
    expect(ref.equals(ref)).toBe(true);
    expect(ref.equals(ref2)).toBe(true);

    const ref3 = new Ref('A', 1);
    expect(ref.equals(ref3)).toBe(true);
    const ref4 = new Ref('A', 2);
    expect(ref.equals(ref4)).toBe(false);
    const ref5 = new Ref('B', 1);
    expect(ref.equals(ref5)).toBe(false);
});

test ('getColumn', () => {
    const ref = new Ref('$A1');
    expect(ref.getColumn()).toBe('A');
    const ref2 = new Ref('$AB10');
    expect(ref2.getColumn()).toBe('AB');
    const ref3 = new Ref('$A100');
    expect(ref3.getColumn()).toBe('A');
    const ref4 = new Ref('$ZZMSMSMS100001230');
    expect(ref4.getColumn()).toBe('ZZMSMSMS');

});

test ('getRow', () => {
    const ref = new Ref('$A1');
    expect(ref.getRow()).toBe(1);
    const ref2 = new Ref('$AB10');
    expect(ref2.getRow()).toBe(10);
    const ref3 = new Ref('$A100');
    expect(ref3.getRow()).toBe(100);
    const ref4 = new Ref('$ZZMSMSMS100001230');
    expect(ref4.getRow()).toBe(100001230);
});

test ('getColumnIndex', () => {
    const ref = new Ref('$A1');
    expect(ref.getColumnIndex()).toBe(1);
    const ref2 = new Ref('$AB10');
    expect(ref2.getColumnIndex()).toBe(28);
    const ref3 = new Ref('$z100');
    expect(ref3.getColumnIndex()).toBe(26);
    const ref5 = new Ref('$Z100');
    expect(ref5.getColumnIndex()).toBe(26);
    const ref6 = new Ref('$ZZ1');
    expect(ref6.getColumnIndex()).toBe(702); //26×26=676 +26=702
    const ref4 = new Ref('$ZZMSMSMS100001230');
    expect(ref4.getColumnIndex()).toBe(217022256873); //26^8+26^7+26^6+26^5+26^4+26^3+26^2+26^1+26^0 = 217022256873
});


test ('test setColumn', () => {
    const ref = new Ref('$A1');
    ref.setColumn('B');
    expect(ref.column).toBe('B');
    ref.setColumn('AB');
    expect(ref.column).toBe('AB');
    ref.setColumn('ZZMSMSMS');
    expect(ref.column).toBe('ZZMSMSMS');
    expect(() => ref.setColumn('')).toThrow('Invalid ref: \"\", 1');
    expect(() => ref.setColumn('A1')).toThrow('Invalid ref: "A1", 1');
    expect(() => ref.setColumn('A-1')).toThrow('Invalid ref: "A-1", 1');
    expect(() => ref.setColumn('A0')).toThrow('Invalid ref: "A0", 1');
    expect(() => ref.setColumn('A1.1')).toThrow('Invalid ref: "A1.1", 1');
    expect(() => ref.setColumn('A-Infinity')).toThrow('Invalid ref: "A-Infinity", 1');
    expect(() => ref.setColumn('A-100')).toThrow('Invalid ref: "A-100", 1');
    expect(() => ref.setColumn('#/@')).toThrow('Invalid ref: "#/@", 1');
    expect(() => ref.setColumn('$%^&*(')).toThrow('Invalid ref: "$%^&*(", 1');
});
    
test ('test setRow', () => {
    const ref = new Ref('$A1');
    ref.setRow(2);
    expect(ref.row).toBe(2);
    ref.setRow(100);
    expect(ref.row).toBe(100);
    ref.setRow(100001230);
    expect(ref.row).toBe(100001230);
    expect(() => ref.setRow(0)).toThrow('Invalid row: 0, cannot be less than 1');
    expect(() => ref.setRow(-1)).toThrow('Invalid row: -1, cannot be less than 1');
    expect(() => ref.setRow(1.1)).toThrow('Invalid row: 1.1, cannot be less than 1');
    expect(() => ref.setRow(NaN)).toThrow('Invalid row: NaN, cannot be less than 1');
    expect(() => ref.setRow(Infinity)).toThrow('Invalid row: Infinity, cannot be less than 1');
    expect(() => ref.setRow(-Infinity)).toThrow('Invalid row: -Infinity, cannot be less than 1');
});

test ('test refToString', () => {
    const ref = new Ref('$A1');
    expect(ref.refToString()).toBe('$A1');
    const ref2 = new Ref('$AB10');
    expect(ref2.refToString()).toBe('$AB10');
    const ref3 = new Ref('$A100');
    expect(ref3.refToString()).toBe('$A100');
    const ref4 = new Ref('$ZZMSMSMS100001230');
    expect(ref4.refToString()).toBe('$ZZMSMSMS100001230');
    const ref5 = new Ref('A', 22);
    expect(ref5.refToString()).toBe('$A22');
});
    



});
