import { evaluateFormula } from '../utils/formula';

describe('evaluateFormula', () => {
  const mockGetCellValue = (ref: string): string | number | null => {
    const mockSheet: { [key: string]: string | number } = {
      '$A1': 1,
      '$B1': 2,
      '$C1': 3
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
});
