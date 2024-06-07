class Ref {
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
      this.column = match[1];
      this.row = parseInt(match[2], 10);
    } else {
      // If row is defined, assume refOrColumn is the column string
      this.column = refOrColumn;
      this.row = row;
    }
  }

  toString(): string {
    return `$${this.column}${this.row}`;
  }

  isEqual(ref: Ref): boolean {
    return this.column === ref.column && this.row === ref.row;
  }

  getColumn(): string {
    return this.column;
  }

  getRow(): number {
    return this.row;
  }

  //converts the column to a number (A=1, B=2, AA=27, AB = 28, etc)
  getColumnIndex(): number {
    return (
      this.column
        .split("")
        .reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1
    );
  }

  setColumn(column: string): void {
    this.column = column;
  }

  setRow(row: number): void {
    this.row = row;
  }
}

export default Ref;
