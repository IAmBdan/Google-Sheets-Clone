
import { Cell } from './cell';
import { Ref } from './ref';
import { Term } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/types/term"
import { columnToNumber } from '../utils/columnToNumber'
import { Publisher } from './publisher'
import { numberToColumnLabel } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/utils/numberToColumnLabel"



 export class Sheet {
//should add name and user and shared users list
    private cells: Cell[][];
    private sheetTitle: string;
    private publisher: Publisher;
    private sharedUsers: Publisher[];
    private sheetID: number;


    constructor(numColumns: number, numRows: number, sheetTitle: string, publisher: Publisher, sharedUsers: Publisher[]){
        if (numColumns < 1 || numRows < 1) {
            throw new Error("Invalid sheet dimensions");
        }
        this.cells = Array.from({ length: numRows }, () =>
            Array.from({ length: numColumns }, () => new Cell(null))
        );
        if (sheetTitle === "") {
            throw new Error("can't be blank");
        }
        this.sheetTitle = sheetTitle;
        this.publisher = new Publisher(publisher.name, publisher.id, publisher.sheets);
        this.publisher.sheets.push(this);
        this.sharedUsers = sharedUsers;
        this.sheetID = NaN;
    }

    getCell(ref: Ref): Cell {
        const columnIndex = ref.getColumnIndex() - 1;
        const rowIndex = ref.row - 1; //assumes rows are 1-indexed, adjust to 0-indexed need to test idk

        if (columnIndex < 0 || columnIndex >= this.cells.length) {
            throw new Error(`Column ${ref.column} is out of bounds`);
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

    setCell(ref: Ref, value: Term): void {
        const cell = this.getCell(ref);
        cell.setValue(value);
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

    getSharedUsers(): Publisher[] {
        return this.sharedUsers;
    }

    setTitle(title: string): void {
        if(title !== "")
        this.sheetTitle = title;
    }

    setPublisher(owner: Publisher): void {
        this.publisher = owner;
    }

    setSharedUsers(sharedUsers: Publisher[]): void {
        this.sharedUsers = sharedUsers;
    }

    addSharedUser(user: Publisher): void {
        if (user.id !== this.publisher.id || !this.sharedUsers.includes(user))
        console.log('user' + user);
        console.log('shared users' + this.sharedUsers);
        this.sharedUsers.push(user);
        console.log('final su' + this.sharedUsers);
    }

    addSharedUsers(users: (Publisher | undefined)[]): void {
        //filters out undefined users
        const validUsers = users.filter((user): user is Publisher => user !== undefined);
        for (const user of validUsers) {
            this.addSharedUser(user); //will use logic from addSharedUser to avoid duplicates
        }
    }

    removeSharedUser(user: Publisher): void {
        this.sharedUsers = this.sharedUsers.filter(u => u !== user);
    }

    removeSharedUsers(users: Publisher[]): void {
        for (const user of users) {
            this.removeSharedUser(user);
        }
    }

    getId(): number {
        return this.sheetID;
    }

    setId(id: number): void {
        if(id >= 0){
        this.sheetID = id;}
    }

    removeAllSharedUsers(): void {
        this.sharedUsers = [];
    }

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

    getCellValueWithRef(ref: Ref): any {
        return this.getCell(ref).getValue();
    }
    getCellValueWithCoords(col: number | string, row: number): any {
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
    const header = `Sheet Title: ${this.sheetTitle}\nPublisher: ${this.publisher.name}\nShared Users: ${this.sharedUsers.map(user => user.name).join(', ')}\nSheet ID: ${this.sheetID}\n`;
    const columnLabels = Array.from({ length: this.cells[0]?.length ?? 0 }, (_, i) => numberToColumnLabel(i + 1));
    const columnHeader = '    ' + columnLabels.join(' | ') + '\n';

    cellDisplay.push(header);
    cellDisplay.push(columnHeader);

    for (let rowIndex = 0; rowIndex < this.cells.length; rowIndex++) {
        const row = this.cells[rowIndex];
        const rowLabel = (rowIndex + 1).toString().padStart(3, ' ');
        const rowValues = row?.map(cell => {
            const value = cell.getValue();
            if (value === null) {
                return ' ';
            } else if (typeof value === 'object' && 'formula' in value) {
                return `=${value.formula}`;
            } else {
                return value.toString();
            }
        }).join(' | ');

        cellDisplay.push(`${rowLabel} | ${rowValues}`);
    }

    return cellDisplay.join('\n');
}
 } 
