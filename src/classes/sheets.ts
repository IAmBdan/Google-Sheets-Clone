//Brian Daniels
//Sheet class that has a 2D array of cells and a title
import { Cell } from "./cell";
import { Ref } from "./ref";
import { Term } from "../types/term";
import { Publisher } from "./publisher";
import { columnToNumber } from "../utils/columnToNumber"
import { numberToColumnLabel } from "../utils/numberToColumnLabel";
import { evaluateFormula } from "../utils/formula";
import { singleUpdate } from "../types/singleUpdate";

type CellValue = number | string | { formula: string } | null;

//Sheet class that has a 2D array of cells and a title and a publisher
 export class Sheet {
//should add name and user and shared users list
    private cells: Cell[][];
    private sheetTitle: string;
    private publisher: Publisher;
    private sheetID: number;
   private listeners: (() => void)[] = [];
   private updates = new Map<Ref, Term>();

  constructor(
    numColumns: number,
    numRows: number,
    sheetTitle: string,
    publisher: Publisher,
    sharedUsers: Publisher[],
  ) {
    if (numColumns < 1 || numRows < 1) {
      throw new Error("Invalid sheet dimensions");
    }
    this.cells = Array.from({ length: numRows }, () =>
      Array.from({ length: numColumns }, () => new Cell(null)),
    );
    if (sheetTitle === "") {
      throw new Error("can't be blank");
    }
    this.sheetTitle = sheetTitle;
    this.publisher = new Publisher(publisher.name, publisher.id);
    this.sheetID = NaN;
  }

  //returns the cell at the given reference
  getCell(ref: Ref): Cell {
    const columnIndex = ref.getColumnIndex() - 1;
    const rowIndex = ref.row - 1;

    if (columnIndex < 0 || columnIndex >= this.cells.length) {
      throw new Error(`Column ${ref.column} (${columnIndex}) is out of bounds`);
    }

    const column = this.cells[columnIndex];
    if (!column || rowIndex < 0 || rowIndex >= column.length) {
      throw new Error(`Row ${ref.row} is out of bounds`);
    }

    const cell = column[rowIndex];
    if (!cell) {
      throw new Error(`Cell at ${ref.row}, ${ref.column} is undefined`);
    }

    return cell;
}

    //returns the number of total cells in the sheet
    getCellCount(): number {
        return this.cells.flat().length;
    }

  //returns the cell at the given coordinates
  getCellByCoords(col: number | string, row: number): Cell {
    let columnIndex: number;

    if (typeof col === "number") {
        columnIndex = col - 1; //adjusts for 1-indexed columns
    } else if (typeof col === "string") {
        columnIndex = columnToNumber(col) - 1; //converts column label to index and adjust for 1-indexed columns, need to test indexes
    } else {
        throw new Error("Invalid column type");
    }

    const rowIndex = row - 1; //adjusts for 1-indexed rows

    if (columnIndex < 0 || columnIndex >= this.cells.length) {
        throw new Error(`Column ${col} is out of bounds`);
    }

    const column = this.cells[columnIndex];
    if (!column || rowIndex < 0 || rowIndex >= column.length) {
        throw new Error(`Row ${row} is out of bounds`);
    }

    const cell = column[rowIndex];
    if (!cell) {
        throw new Error(`Cell at row ${row}, column ${col} is undefined`);
    }

    return cell;
}

  getCells(): Cell[][] {
    return this.cells;
  }

  getPublisher(): Publisher {
    return this.publisher;
  }

  getTitle(): string {
    return this.sheetTitle;
  }


  addListener(listener: () => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: () => void): void {
    const index = this.listeners.indexOf(listener);

    if (index === -1) {
      console.warn("Listener not found!");
    } else {
      this.listeners.splice(index, 1);
    }
  }

  setCell(ref: Ref, value: Term, isClientUpdate: boolean): void {
    if (ref && value) {
      const cell = this.getCell(ref);
      cell.setValue(value);

      if (isClientUpdate) {
        this.updates.set(ref, value);
      }

      this.listeners.forEach((l) => l());
    }
  }

  //evaluates the formula of the cell at the given reference
  evaluateCellFormula(ref: Ref): void {
    const cell = this.getCell(ref);
    const value = cell.getValue();
    if (typeof value === "string" && value.startsWith('=')) {
      const getCellValue = (cellRef: string): string | number | null => {
        const cellRefObj = new Ref(cellRef.slice(1, 2), parseInt(cellRef.slice(2)));
        const cellValue = this.getCell(cellRefObj).getValue();
        if (cellValue === null) {
          throw new Error(`Reference ${cellRef} not found`);
        }
        if (typeof cellValue === "object" && cellValue !== null && 'formula' in cellValue) {
          return cellValue.formula;
        }
        return cellValue;
      };

      const result = evaluateFormula(value, getCellValue);
      this.setCell(ref, result as Term, false);
    }
  }

  //returns the size of the sheet
  getSize(): { columns: number; rows: number } {
    return { columns: this.cells.length, rows: this.cells[0]?.length ?? 0 };
  }

  setTitle(title: string): void {
    if (title !== "") this.sheetTitle = title;
    else {
      throw new Error("Invalid title");
    }
  }

  setPublisher(owner: Publisher): void {
    if (owner) {
      this.publisher = owner;
    }
  }

  getId(): number {
    return this.sheetID;
  }

  setId(id: number): void {
    if (id < 0 || id === -Infinity || id === Infinity || Number.isNaN(id)) {
      throw new Error("Invalid id");
    } else {
      this.sheetID = id;
    }
  }

    //returns the cells in the given range
    getCellsInRange(start: Ref, end: Ref): Cell[] { //inclusive of start and end
        const startColIndex = start.getColumnIndex();
        const startRowIndex = start.row;
        const endColIndex = end.getColumnIndex();
        const endRowIndex = end.row;
        const cells: Cell[] = [];

        for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
            for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
                const cell = this.getCell(new Ref(numberToColumnLabel(colIndex), rowIndex));
                cells.push(cell);
            }
        }
        return cells;
    }

    //returns the value of the cell at the given reference
    getCellValueWithRef(ref: Ref): any {
        return this.getCell(ref).getValue();
    }

    //returns the value of the cell at the given coordinates
    getCellValueWithCoords(col: number | string, row: number): any {
        return this.getCellByCoords(col, row).getValue();
    }

    //sets the value of the cell at the given reference
    setCellValueWithRef(ref: Ref, value: Term): void {
        this.setCell(ref, value, false);
    }

    //sets the value of the cell at the given coordinates
    setCellValueWithCoords(col: number | string, row: number, value: Term): void {
        this.getCellByCoords(col, row).setValue(value);
    }

    //returns all cells with the given value
    getCellsWithValue(value: Term): Cell[] {
        const cells: Cell[] = [];
        for (const column of this.cells) {
            for (const cell of column) {
                if (cell.getValue() === value) {
                    cells.push(cell);
                }
            }
        }
        return cells;
    }

    //returns a string representation of the sheet
    toString(): string {
        const cellDisplay: string[] = [];
        const header = `Sheet Title: ${this.sheetTitle}\nPublisher: ${this.publisher.getName()}\nSheet ID: ${this.sheetID}\n`;
        const numCols = this.cells[0]?.length ?? 0;
        const columnLabels = Array.from({ length: numCols }, (_, i) => numberToColumnLabel(i + 1).padStart(3, ' '));
        const columnHeader = '    ' + columnLabels.join(' | ') + '\n';

        cellDisplay.push(header);
        cellDisplay.push(columnHeader);

        for (let rowIndex = 0; rowIndex < this.cells.length; rowIndex++) {
            const row = this.cells[rowIndex];
            const rowLabel = (rowIndex + 1).toString().padStart(3, ' ');
            if (row){
            const rowValues = row.map(cell => {
                const value = cell.getValue();
                if (value === null) {
                    return '   ';
                } else if (typeof value === 'object' && 'formula' in value) {
                    return `=${value.formula}`.padStart(3, ' ');
                } else {
                    return value.toString().padStart(3, ' ');
                }
            }).join(' | ');

            cellDisplay.push(`${rowLabel} | ${rowValues}`);
        }}

        return cellDisplay.join('\n');
    }

    //returns a string representation of the sheet with the given range
    singleUpdate(ref: Ref, value: Term): void {
        this.setCell(ref, value, false);
    }

    //returns a string representation of the sheet with the given range
    singleUpdateWithSingleUpdate(singleUpdate: singleUpdate): void {
        this.setCell(singleUpdate.ref, singleUpdate.term, false);
    }

    //returns a string representation of the sheet with the given range
    multiUpdate(values: singleUpdate[]): void {
        for (const { ref, term } of values) {
            this.setCell(ref, term, false);
        }
    }

    generateUpdate(): singleUpdate[] {
        const updates: singleUpdate[] = [];
        for (const [ref, term] of this.updates) {
            updates.push({ ref, term });
        }
        this.updates.clear();
        return updates;
    }
}
