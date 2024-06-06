import { evaluateFormula } from '../utils/formula';

describe('evaluateFormula', () => {
  const mockGetCellValue = (ref: string): string | number | null => {
    const mockSheet: { [key: string]: string | number } = {
      '$A1': 1,
      '$B1': 2,
      '$C1': 3,
      '$D1': 'hello',
      '$E1': 'world',
      '$F1': -1,
      '$G1': 100
    };
    return mockSheet[ref] || null;
  };

  it('should evaluate a simple number', () => {
    expect(evaluateFormula('1', mockGetCellValue)).toBe(1);
  });

  it('should evaluate a simple string', () => {
    expect(evaluateFormula('"hello"', mockGetCellValue)).toBe('hello');
  });

  it('should evaluate a reference', () => {
    expect(evaluateFormula('$A1', mockGetCellValue)).toBe(1);
  });

  it('should throw an error for an invalid reference', () => {
    expect(() => evaluateFormula('$Z1', mockGetCellValue)).toThrow('Reference $Z1 not found');
  });

  it('should evaluate a formula with SUM function', () => {
    expect(evaluateFormula('=SUM($A1,$B1)', mockGetCellValue)).toBe(3);
  });

  it('should evaluate a formula with SUM function with multiple arguments', () => {
    expect(evaluateFormula('=SUM($A1,$B1,$C1)', mockGetCellValue)).toBe(6);
  });

  it('should evaluate a formula with CONCAT function', () => {
    expect(evaluateFormula('=CONCAT($D1,$E1)', mockGetCellValue)).toBe('helloworld');
  });

  it('should evaluate a formula with CONCAT function with literals', () => {
    expect(evaluateFormula('=CONCAT("foo","bar")', mockGetCellValue)).toBe('foobar');
  });

  it('should evaluate a formula with CONCAT function with references and literals', () => {
    expect(evaluateFormula('=CONCAT($D1," ",$E1)', mockGetCellValue)).toBe('hello world');
  });

  it('should evaluate a formula with MIN function', () => {
    expect(evaluateFormula('=MIN($A1,$B1,$C1,$F1)', mockGetCellValue)).toBe(-1);
  });

  it('should evaluate a formula with MIN function with literals', () => {
    expect(evaluateFormula('=MIN(10,20,30,5)', mockGetCellValue)).toBe(5);
  });

  it('should evaluate a formula with MAX function', () => {
    expect(evaluateFormula('=MAX($A1,$B1,$C1,$G1)', mockGetCellValue)).toBe(100);
  });

  it('should evaluate a formula with MAX function with literals', () => {
    expect(evaluateFormula('=MAX(10,20,30,5)', mockGetCellValue)).toBe(30);
  });

  it('should evaluate a formula with AVG function', () => {
    expect(evaluateFormula('=AVG($A1,$B1,$C1)', mockGetCellValue)).toBe(2);
  });

  it('should evaluate a formula with AVG function with literals', () => {
    expect(evaluateFormula('=AVG(10,20,30)', mockGetCellValue)).toBe(20);
  });

  it('should evaluate a formula with IF function when condition is true', () => {
    expect(evaluateFormula('=IF(1,"true","false")', mockGetCellValue)).toBe('true');
  });

  it('should evaluate a formula with IF function when condition is false', () => {
    expect(evaluateFormula('=IF(0,"true","false")', mockGetCellValue)).toBe('false');
  });

  it('should throw an error for IF function with invalid condition', () => {
    expect(() => evaluateFormula('=IF("true",$A1,$B1)', mockGetCellValue)).toThrow('IF condition must be a number');
  });

  it('should evaluate a formula with IF function and reference condition', () => {
    expect(evaluateFormula('=IF($A1,"true","false")', mockGetCellValue)).toBe('true');
  });

  it('should evaluate a formula with IF function and reference condition being zero', () => {
    expect(evaluateFormula('=IF($F1,"true","false")', mockGetCellValue)).toBe('true');
  });

  it('should evaluate a formula with IF function and nested formulas', () => {
    expect(evaluateFormula('=IF($A1, SUM($A1,$B1), "false")', mockGetCellValue)).toBe(3);
  });

  it('should throw an error for IF function with missing arguments', () => {
    expect(() => evaluateFormula('=IF($A1,"true")', mockGetCellValue)).toThrow('IF function requires 3 arguments');
  });

  it('should evaluate a formula with DEBUG function', () => {
    expect(evaluateFormula('=DEBUG($A1)', mockGetCellValue)).toBe(1);
  });

  it('should evaluate a formula with DEBUG function and literal', () => {
    expect(evaluateFormula('=DEBUG("test")', mockGetCellValue)).toBe('test');
  });
});
