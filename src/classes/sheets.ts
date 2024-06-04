
import { Cell } from './cell';
import { Ref } from './ref';
import { Term } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/types/term"
import { columnToNumber } from '../utils/columnToNumber'
import { Publisher } from '~/server/tests/testGetPublishers';


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

    getAllUsers(): string[] {
        return [this.owner, ...this.sharedUsers];
    }

    getOwner(): string {
        return this.owner;
    }

    getTitle(): string {
        return this.title;
    }

    getSharedUsers(): string[] {
        return this.sharedUsers;
    }

    setTitle(title: string): void {
        if(title !== "")
        this.title = title;
    }

    setOwner(owner: string): void {
        if(owner !== "")
        this.owner = owner;
    }

    setSharedUsers(sharedUsers: string[]): void {
        this.sharedUsers = sharedUsers;
    }

    addSharedUser(user: string): void {
        if (user !== "" || user !== this.owner || !this.sharedUsers.includes(user))
        this.sharedUsers.push(user);
    }
    addSharedUsers(users: string[]): void {
        this.sharedUsers.push(...users);
    }

    getCellValueWithRef(ref: Ref): any {
        return this.getCell(ref).getValue();
    }
    getCellValueWithCoords(col: number | string, row: number): any {
        return this.getCellByCoords(col, row).getValue();
    }
}


  