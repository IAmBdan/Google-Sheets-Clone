

class Ref {
        column: string;
        row: number;


    constructor(ref: string) {
        const match = /^\$([A-Za-z]+)(\d+)$/.exec(ref.toUpperCase());
        if (!match) throw new Error(`Invalid ref: ${ref}`);
        if (!match[1] || !match[2]) { throw new Error(`Invalid ref: ${ref}`);}
        else {
        this.column = match[1];
        this.row = parseInt(match[2], 10);
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

    //converts the column to a number (A=1, B=2, AA=27, etc)
    getcolumnIndex(): number {
        return this.column.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1; 
    }

    




}