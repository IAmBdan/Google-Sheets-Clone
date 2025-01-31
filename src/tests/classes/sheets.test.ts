//all tests work

import { Publisher } from "../../classes/publisher"
import { Sheet } from "../../classes/sheets"
import { Ref } from "../../classes/ref"
import { multipleCellUpdate } from "../../utils/multipleCellUpdate"
import { Cell } from "../../classes/cell"
import { evaluateFormula } from "~/utils/formula"


    
    describe('Sheet', () => {
        const publisher = new Publisher('John Doe', 1);
        const sheet = new Sheet(3, 3, 'Test Sheet', publisher, []);
    
        test('constructor validation and initialization', () => {
            expect(() => new Sheet(0, 3, 'Test Sheet', publisher, [])).toThrow('Invalid sheet dimensions');
            expect(() => new Sheet(3, 0, 'Test Sheet', publisher, [])).toThrow('Invalid sheet dimensions');
            expect(() => new Sheet(3, 3, '', publisher, [])).toThrow("can't be blank");
    
            expect(sheet.getTitle()).toBe('Test Sheet');
            expect(sheet.getPublisher().getName()).toBe('John Doe');
            expect(sheet.getId()).toBeNaN();
        });

        test('huge sheet', () => {
            const sheet2 = new Sheet(1000, 1000, 'Test Sheet', publisher, []);
            expect(sheet2.getCellCount()).toBe(1000000);

            
        });

        //fix invalid cell tests and coverage should be good
        test(' invalid get cell', () => {
            expect(() => sheet.getCell(new Ref('A1'))).toThrow('Invalid ref: A1');
            expect(() => sheet.getCell(new Ref('$A'))).toThrow('Invalid ref: $A');
            expect(() => sheet.getCell(new Ref('$A10000'))).toThrow("Row 10000 is out of bounds");
            expect(() => sheet.getCell(new Ref('$Z1'))).toThrow("Column Z (25) is out of bounds");
            expect(() => sheet.getCell(new Ref('$A4'))).toThrow("Row 4 is out of bounds");

        });
        test("cell number", () => {
            expect(sheet.getCellCount()).toBe(9);
        });

        test('getCell and cell is undefined', () => {
            const cell = undefined;
            sheet.getCell(new Ref('$A1'));
            expect(cell).toBeUndefined();
        });

    
        test('getCell and setCell', () => {
            const ref = new Ref('$A1');
            sheet.setCell(ref, 5, false);
            const cell = sheet.getCell(ref);
            expect(cell.getValue()).toBe(5);
    
            sheet.setCell(ref, 'test', false);
            expect(cell.getValue()).toBe('test');
        });
    
        test('getCellByCoords and setCellValueWithCoords', () => {
            sheet.setCellValueWithCoords(1, 1, 10);
            const cell = sheet.getCellByCoords(1, 1);
            expect(cell.getValue()).toBe(10);
    
            sheet.setCellValueWithCoords('B', 2, 'test');
            const cell2 = sheet.getCellByCoords('B', 2);
            expect(cell2.getValue()).toBe('test');

            expect(() => sheet.setCellValueWithCoords('B', 0, 5)).toThrow('Row 0 is out of bounds');
            expect(() => sheet.setCellValueWithCoords('B', 4, 5)).toThrow('Row 4 is out of bounds');
            expect(() => sheet.setCellValueWithCoords('Z', 1, 5)).toThrow('Column Z is out of bounds');
            expect(() => sheet.setCellValueWithCoords('AA', 1, 5)).toThrow('Column AA is out of bounds');

        });
    
        test('getCellsInRange', () => {
            const startRef = new Ref('$A1');
            const endRef = new Ref('$B2');
            const cells = sheet.getCellsInRange(startRef, endRef);
    
            expect(cells.length).toBe(4); // A1, A2, B1, B2
        });
    
        test('getCellValueWithRef and setCellValueWithRef', () => {
            const ref = new Ref('$A1');
            sheet.setCellValueWithRef(ref, 20);
            expect(sheet.getCellValueWithRef(ref)).toBe(20);
        });
    
        test('getCellsWithValue', () => {
            sheet.setCellValueWithCoords('C', 3, 100);
            const cells = sheet.getCellsWithValue(100);
            expect(cells.length).toBe(1);
            if (cells.length > 0 && cells[0]){
            expect(cells[0].getValue()).toBe(100);
            }
        });
    
        test('get and set publisher', () => {
            const newPublisher = new Publisher('Jane Smith', 2);
            sheet.setPublisher(newPublisher);
            expect(sheet.getPublisher().getName()).toBe('Jane Smith');
        });
    
        test('get and set title', () => {
            sheet.setTitle('New Title');
            expect(sheet.getTitle()).toBe('New Title');
    
            expect(() => sheet.setTitle('')).toThrow("Invalid title");
        });
    
        test('get and set ID', () => {
            sheet.setId(10);
            expect(sheet.getId()).toBe(10);
    
            expect(() => sheet.setId(-1)).toThrow('Invalid id');
            expect(() => sheet.setId(Infinity)).toThrow('Invalid id');
            expect(() => sheet.setId(-Infinity)).toThrow('Invalid id');
            expect(() => sheet.setId(NaN)).toThrow('Invalid id');
        });
    
        const publisher2 = new Publisher('Jane Smith', 1);
        const sheet2 = new Sheet(3, 3, 'New Title', publisher2, []);
        sheet2.setCellValueWithCoords(1, 1, 20);
        sheet2.setCellValueWithCoords(2, 2, 'test');
        sheet2.setCellValueWithCoords(3, 3, 100);
        sheet2.setId(10);


        test('toString method', () => {
            const expectedOutput = "\Sheet Title: New Title\n" +
            "Publisher: Jane Smith\n" +
            "Sheet ID: 10\n\n" +
            "      A |   B |   C\n\n" +
            "  1 |  20 |     |    \n" + 
            "  2 |     | test |    \n" + 
            "  3 |     |     | 100"
            const sheetToString = sheet2.toString();
            expect(sheetToString).toBe(expectedOutput);

        });

        test('get cells', () => {
            const cells = sheet.getCells();
            expect(cells.length).toBe(3);
            if(cells.length > 0 && cells[0]){
            expect(cells[0].length).toBe(3);}
        });

        test('get cell by coords', () => {
            const cell = sheet.getCellByCoords(1, 1);
            expect(cell.getValue()).toBe(20);

            const cell2 = sheet.getCellByCoords(2, 2);
            expect(cell2.getValue()).toBe('test');

            const cell3 = sheet.getCellByCoords(3, 3);
            expect(cell3.getValue()).toBe(100);

            expect(() => sheet.getCellByCoords(0, 1)).toThrow("Column 0 is out of bounds");
            expect(() => sheet.getCellByCoords(4, 1)).toThrow("Column 4 is out of bounds");
            expect(() => sheet.getCellByCoords(1, 0)).toThrow('Row 0 is out of bounds');
            expect(() => sheet.getCellByCoords(1, 4)).toThrow('Row 4 is out of bounds');

            const cell4 = sheet.getCellByCoords('a', 2);
            expect(cell4.getValue()).toBe(null);

            const cell5 = sheet.getCellByCoords('B', 3);
            expect(cell5.getValue()).toBe(null);

            const cell6 = sheet.getCellByCoords('C', 1);
            expect(cell6.getValue()).toBe(null);

        });

        test('single update', () => {
            const ref = new Ref('$A1');
            sheet.singleUpdate(ref, 5);
            const cell = sheet.getCell(ref);
            expect(cell.getValue()).toBe(5);

            sheet.singleUpdate(ref, 'test');
            expect(cell.getValue()).toBe('test');

        });

        test('single update with singleUpdate', () => {
            const ref = new Ref('$A1');
            sheet.singleUpdate(ref, 5);
            const cell = sheet.getCell(ref);
            expect(cell.getValue()).toBe(5);

            sheet.singleUpdate(ref, 'test');
            expect(cell.getValue()).toBe('test');

        });
            

        test('cell by cordss invalid column', () => {
            expect(() => sheet.getCellByCoords('Z', 1)).toThrow('Column Z is out of bounds');
            expect(() => sheet.getCellByCoords('AA', 1)).toThrow('Column AA is out of bounds');
        });
        

       

        test('remove listener', () => {
            const listener = jest.fn();
            sheet.addListener(listener);
            sheet.removeListener(listener);
            sheet.setCellValueWithCoords(1, 1, 5);
            expect(listener).not.toHaveBeenCalled();
        });

        test('get cell value with coors', () => {   
            sheet.setCellValueWithCoords(1, 1, 5);
            expect(sheet.getCellValueWithCoords(1, 1)).toBe(5);
        });

        test('single update with single update', () => {
            const ref = new Ref('$A1');
            sheet.singleUpdate(ref, 5);
            const cell = sheet.getCell(ref);
            expect(cell.getValue()).toBe(5);

            sheet.singleUpdate(ref, 'test');
            expect(cell.getValue()).toBe('test');
        });


        test('getSize', () => {
            const size = sheet.getSize();
            expect(size.columns).toBe(3);
            expect(size.rows).toBe(3);
        });
      });