import { Cell } from "./cell";
import { Ref } from "./ref";
import { Term } from "../types/term";
import { Publisher } from "./publisher";
import { columnToNumber } from "~/utils/columnToNumber";
import { numberToColumnLabel } from "~/utils/numberToColumnLabel";

type CellValue = number | string | { formula: string } | null;

export class Sheet {
  private cells: Cell[][];
  private sheetTitle: string;
  private publisher: Publisher;
  private sheetID: number;
  //should add name and user and shared users list
  private listeners: (() => void)[] = [];

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

  getCell(ref: Ref): Cell {
    const columnIndex = ref.getColumnIndex() - 1;
    const rowIndex = ref.row - 1; //assumes rows are 1-indexed, adjust to 0-indexed need to test idk

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

  setCell(ref: Ref, value: Term): void {
    if (ref && value) {
      const cell = this.getCell(ref);
      cell.setValue(value);

      this.listeners.forEach((l) => l());
    }
  }

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

  getCellsInRange(start: Ref, end: Ref): Cell[] {
    //inclusive of start and end
    const startColIndex = start.getColumnIndex();
    const startRowIndex = start.row;
    const endColIndex = end.getColumnIndex();
    const endRowIndex = end.row;
    const cells: Cell[] = [];

    for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
      for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
        const cell = this.getCell(
          new Ref(numberToColumnLabel(colIndex), rowIndex),
        );
        cells.push(cell);
      }
    }
    return cells;
  }

  getCellValueWithRef(ref: Ref): CellValue {
    return this.getCell(ref).getValue();
  }

  getCellValueWithCoords(col: number | string, row: number): CellValue {
    return this.getCellByCoords(col, row).getValue();
  }

  setCellValueWithRef(ref: Ref, value: Term): void {
    this.setCell(ref, value);
  }

  setCellValueWithCoords(col: number | string, row: number, value: Term): void {
    this.getCellByCoords(col, row).setValue(value);
  }

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

  toString(): string {
    const cellDisplay: string[] = [];
    const header = `Sheet Title: ${this.sheetTitle}\nPublisher: ${this.publisher.getName()}\nSheet ID: ${this.sheetID}\n`;
    const numCols = this.cells[0]?.length ?? 0;
    const columnLabels = Array.from({ length: numCols }, (_, i) =>
      numberToColumnLabel(i + 1).padStart(3, " "),
    );
    const columnHeader = "    " + columnLabels.join(" | ") + "\n";

    cellDisplay.push(header);
    cellDisplay.push(columnHeader);

    for (let rowIndex = 0; rowIndex < this.cells.length; rowIndex++) {
      const row = this.cells[rowIndex];
      const rowLabel = (rowIndex + 1).toString().padStart(3, " ");
      if (row) {
        const rowValues = row
          .map((cell) => {
            const value = cell.getValue();
            if (value === null) {
              return "   ";
            } else if (typeof value === "object" && "formula" in value) {
              return `=${value.formula}`.padStart(3, " ");
            } else {
              return value.toString().padStart(3, " ");
            }
          })
          .join(" | ");

        cellDisplay.push(`${rowLabel} | ${rowValues}`);
      }
    }

    return cellDisplay.join("\n");
  }
}
