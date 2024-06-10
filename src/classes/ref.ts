//Brian Daniels
// Purpose: Contains the Ref class which is used to represent a cell reference in a spreadsheet

// Ref class that represents a cell reference in a spreadsheet 
export class Ref {
  column: string;
  row: number;

  constructor(ref: string);
  constructor(column: string, row: number);
  constructor(refOrColumn: string, row?: number) {
    if (typeof row === "undefined") {
      // If row is undefined, assume refOrColumn is the reference string
      const match = /^\$([A-Za-z]+)(\d+)$/.exec(refOrColumn.toUpperCase());
      if (!match?.[1] || !match[2]) {
        throw new Error(`Invalid ref: ${refOrColumn}`);
      }
      const checkForNegativeRow = parseInt(match[2], 10);
      if (checkForNegativeRow < 1) {
        throw new Error(
          `Invalid row: ${checkForNegativeRow}, cannot be less than 1`,
        );
      }
      this.row = checkForNegativeRow;
      this.column = match[1];
    } else {
      if (!/^[A-Za-z]+$/.test(refOrColumn)) {
        throw new Error(`Invalid ref: "${refOrColumn}", ${row}`);
      }
      // If row is defined, assume refOrColumn is the column string
      this.column = refOrColumn;
      if (
        row < 1 ||
        Number.isNaN(row) ||
        row % 1 !== 0 ||
        row === Infinity ||
        row === -Infinity
      ) {
        throw new Error(`Invalid row: ${row}, cannot be less than 1`);
      } else {
        this.row = row;
      }
    }
  }

  toString(): string {
    return `$${this.column}${this.row}`;
  }

  getColumn(): string {
    return this.column;
  }

  //converts the column to a number (A=1, B=2, AA=27, AB = 28, etc)
  getColumnIndex(): number {
    this.column = this.column.toUpperCase();
    let result = 0;
    const label = this.column;
    const length = label.length;

    for (let i = 0; i < length; i++) {
      result *= 26;
      result += label.charCodeAt(i) - "A".charCodeAt(0) + 1;
    }
    return result;
  }

    //checks if two refs are equal
    equals(ref: Ref): boolean {
        return this.column === ref.column && this.row === ref.row;
    }
  setColumn(column: string): void {
    if (new Ref(column, this.row)) {
      this.column = column;
    }
  }

    //converts the ref to a string
    refToString(): string {
        return "$"  + this.column + this.row;
    }
  setRow(row: number): void {
    if (new Ref(this.column, row) && row >= 1) {
      this.row = row;
    }
  }

  equals(ref: Ref): boolean {
    return this.column === ref.column && this.row === ref.row;
  }

  refToString(): string {
    return "$" + this.column + this.row;
  }
}
