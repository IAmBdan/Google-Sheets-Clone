import { hasSpecialChar } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/utils/hasSpecialChar";
import { Sheet } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/sheets"

export class Publisher {
    name: string;
    id: number;
    sheets: Sheet[];

    constructor(name: string, id: number, sheets: Sheet[]) {
        if(name === undefined || hasSpecialChar(name)) throw new Error("Invalid name");
        this.name = name; 
        if(id < 0 || id === (Infinity || -Infinity) || Number.isNaN(id)) throw new Error("Invalid id");
        this.id = id;
        this.sheets = sheets;
    }

    getName(): string {
        return this.name;
    }

    getId(): number {
        return this.id;
    }

    getSheets(): Sheet[] {
        return this.sheets;
    }

    addSheet(sheet: Sheet): void {
        this.sheets.push(sheet);
    }

    removeSheet(sheet: Sheet): void {
        this.sheets = this.sheets.filter(s => s !== sheet);
    }

    getSheetByName(sheetName: string): Sheet {
        const sheet = this.sheets.find(s => s.getTitle() === sheetName);
        if(sheet === undefined) throw new Error("Sheet not found");
        return sheet;
    }

    getSheetByIndex(index: number): Sheet {
        if (index < 0 || index >= this.sheets.length) throw new Error("Index out of bounds");
        const sheet = this.sheets[index];
        if (!sheet) throw new Error("Sheet not found");
        return sheet;
    }

    getSheetById(sheetId: number): Sheet {
        const sheet = this.sheets.find(s => s.getId() === sheetId);
        if(sheet === undefined) throw new Error("Sheet not found");
        return sheet;
    }

    getSheetCount(): number {
        return this.sheets.length;
    }

    setName(name: string): void {
        if(name === undefined) throw new Error("Invalid name");
        this.name = name;
    }

    setId(id: number): void {
        if(id === undefined) throw new Error("Invalid id");
        this.id = id;
    }

    setSheets(sheets: Sheet[]): void {
        if(sheets === undefined) throw new Error("Invalid sheets");
        this.sheets = sheets;
    }

    addSheets(sheets: Sheet[]): void {
        if(sheets === undefined) throw new Error("Invalid sheets");
        this.sheets.push(...sheets);
    }

    removeSheets(sheets: Sheet[]): void {
        if(sheets === undefined) throw new Error("Invalid sheets");
        this.sheets = this.sheets.filter(s => !sheets.includes(s));
    }

    removeSheetByIndex(index: number): void {
        if (index < 0 || index >= this.sheets.length) throw new Error("Index out of bounds");
        this.sheets.splice(index, 1);
    }

    removeSheetById(sheetId: number): void {
        const index = this.sheets.findIndex(s => s.getId() === sheetId);
        if (index === -1) throw new Error("Sheet not found");
        this.sheets.splice(index, 1);
    }

    removeSheetByName(sheetName: string): void {
        const index = this.sheets.findIndex(s => s.getTitle() === sheetName);
        if (index === -1) throw new Error("Sheet not found");
        this.sheets.splice(index, 1);
    }
    
    removeAllSheets(): void {
        this.sheets = [];
    }

    getSheetIndex(sheet: Sheet): number {
        return this.sheets.indexOf(sheet);
    }

    getSheetIndexById(sheetId: number): number {
        return this.sheets.findIndex(s => s.getId() === sheetId);
    }

    getSheetIndexByName(sheetName: string): number {
        return this.sheets.findIndex(s => s.getTitle() === sheetName);
    }


}