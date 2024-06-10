
import { Publisher } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/publisher"
import { SheetGraphManager } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/sheetGraphManager"
import { Sheet } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/sheets"

//Brian Daniels
// Utility function to create a new Sheet with a publisher
const createSheet = (id: number, title: string, publisher: Publisher, numCols = 3, numRows = 3) => {
    const sheet = new Sheet(numCols, numRows, title, publisher, []);
    sheet.setId(id);
    return sheet;
};

describe('SheetGraphManager', () => {
    let manager: SheetGraphManager;
    let publisher1: Publisher;
    let publisher2: Publisher;
    let sheet1: Sheet;
    let sheet2: Sheet;

    beforeEach(() => {
        manager = new SheetGraphManager();
        publisher1 = new Publisher('John Doe', 1);
        publisher2 = new Publisher('Jane Smith', 2);
        sheet1 = createSheet(1, 'Sheet 1', publisher1);
        sheet2 = createSheet(2, 'Sheet 2', publisher2);
    });

    test('add and remove publisher', () => {
        manager.addPublisher(publisher1);
        expect(manager.getPublisher(publisher1.getId())).toBe(publisher1);

        manager.removePublisher(publisher1.getId());
        expect(manager.getPublisher(publisher1.getId())).toBeUndefined();
  
    });

    test('add and remove sheet', () => {
        manager.addPublisher(publisher1);
        manager.addSheet(sheet1, publisher1);
        expect(manager.getSheet(sheet1.getId())).toBe(sheet1);
        

        manager.removeSheet(sheet1.getId());
        expect(manager.getSheet(sheet1.getId())).toBeUndefined();
    });

    test('get publisher for sheet', () => {
        manager.addPublisher(publisher1);
        manager.addSheet(sheet1, publisher1);
        expect(manager.getPublisherForSheet(sheet1.getId())).toBe(publisher1);
    });

    test('get shared users for sheet', () => {
        manager.addPublisher(publisher1);
        manager.addPublisher(publisher2);
        manager.addSheet(sheet1, publisher1, [publisher2]);
        expect(manager.getSharedUsersForSheet(sheet1.getId())).toContain(publisher2);
    });

    test('add and remove shared user from sheet', () => {
        manager.addPublisher(publisher1);
        manager.addPublisher(publisher2);
        manager.addSheet(sheet1, publisher1);
        manager.addSharedUserToSheet(sheet1.getId(), publisher2);
        expect(manager.getSharedUsersForSheet(sheet1.getId())).toContain(publisher2);

        manager.removeSharedUserFromSheet(sheet1.getId(), publisher2.getId());
        expect(manager.getSharedUsersForSheet(sheet1.getId())).not.toContain(publisher2);
    });

    test('get sheets for publisher', () => {
        manager.addPublisher(publisher1);
        manager.addSheet(sheet1, publisher1);
        manager.addSheet(sheet2, publisher1); // Assume the same publisher for simplicity
        expect(manager.getSheetsForPublisher(publisher1.getId())).toEqual([sheet1, sheet2]);
    });

    test('add sheet to publisher', () => {
        manager.addPublisher(publisher1);
        manager.addPublisher(publisher2);
        manager.addSheet(sheet1, publisher1);
        manager.addSheetToPublisher(sheet2.getId(), publisher1.getId());
        expect(manager.getPublisherForSheet(sheet2.getId())).toBe(publisher1);
    });

    test('remove sheet from publisher', () => {
        manager.addPublisher(publisher1);
        manager.addSheet(sheet1, publisher1);
        manager.removeSheetFromPublisher(sheet1.getId());
        expect(manager.getPublisherForSheet(sheet1.getId())).toBeUndefined();
    });

    test('add existing publisher should throw error', () => {
        manager.addPublisher(publisher1);
        expect(() => manager.addPublisher(publisher1)).toThrow('Publisher already exists');
    });

    test('add sheet with non-existent publisher should throw error', () => {
        expect(() => manager.addSheet(sheet1, publisher1)).toThrow('Publisher not found');
    });

    test('add shared user to non-existent sheet should throw error', () => {
        manager.addPublisher(publisher1);
        manager.addPublisher(publisher2);
        expect(() => manager.addSharedUserToSheet(sheet1.getId(), publisher2)).toThrow('Sheet not found');
    });

    test('remove shared user from non-existent sheet should throw error', () => {
        manager.addPublisher(publisher1);
        expect(() => manager.removeSharedUserFromSheet(sheet1.getId(), publisher1.getId())).toThrow('Sheet not found');
    });

    test('remove non-existent sheet should throw error', () => {
        expect(() => manager.removeSheet(sheet1.getId())).toThrow('Sheet not found');
    });

    test('remove non-existent publisher should throw error', () => {
        expect(() => manager.removePublisher(publisher1.getId())).toThrow('Publisher not found');
    });

    test( 'remove all one publishers multiple sheets', () => {
        manager.addPublisher(publisher1);
        manager.addSheet(sheet1, publisher1);
        manager.addSheet(sheet2, publisher1);
        manager.removePublisher(publisher1.getId());
        expect(manager.getSheet(sheet1.getId())).toBeUndefined();
        expect(manager.getSheet(sheet2.getId())).toBeUndefined();
        

    });

    test( 'add sheet that already exists', () => {
        manager.addPublisher(publisher1);
        manager.addSheet(sheet1, publisher1);
        expect(() => manager.addSheet(sheet1, publisher1)).toThrow('Sheet already exists');
    });

    test( 'add a shared user to sheet that is not found', () => {
        manager.addPublisher(publisher1);
        manager.addPublisher(publisher2);
        expect(() => manager.addSharedUserToSheet(sheet1.getId(), publisher2)).toThrow('Sheet not found');


    });

    test (' shared user not found', () => {
        manager.addPublisher(publisher1);
        manager.addSheet(sheet1, publisher1);
        expect(() => manager.removeSharedUserFromSheet(sheet1.getId(), publisher2.getId())).toThrow('Shared user not found');
    });

    test (' addSharedUserToSheet errors', () => {
        manager.addPublisher(publisher1);
        manager.addSheet(sheet1, publisher1);
    const publisher10 = new Publisher('Jane Smith', 10);
        expect(() => manager.addSharedUserToSheet(sheet1.getId(), publisher10)).toThrow('Shared user not found');

    });

    test ('removeSheetFromPublisher errors', () => {
        manager.addPublisher(publisher1);
        expect(() => manager.removeSheetFromPublisher(sheet1.getId())).toThrow('Sheet not found');
});
    test ('addSheetToPublisher', () => {
        const publisher12 = new Publisher('Jane Smith', 12);
        const publisher13 = new Publisher('Jack Daniels', 13);
        const sheet3 = createSheet(3, 'Sheet 3', publisher12);
        const sheet4 = createSheet(4, 'Sheet 4', publisher12);
        manager.addPublisher(publisher13);
        manager.addPublisher(publisher12);
        manager.addSheet(sheet3, publisher13);
        manager.addSharedUserToSheet(sheet3.getId(), publisher13);
        manager.addSheet(sheet4, publisher13);
        manager.addSheetToPublisher(sheet3.getId(), publisher13.getId());
        expect(manager.getPublisherForSheet(sheet3.getId())).toBe(publisher13);
        expect(manager.getPublisherForSheet(sheet4.getId())).toBe(publisher13)
        expect(manager.getSheetsForPublisher(publisher13.getId())).toEqual([sheet3, sheet4]);
        expect(manager.getSheetsForPublisher(publisher12.getId())).toEqual([]);
        expect(manager.getSharedUsersForSheet(sheet3.getId())).toContain(publisher13);


        
        
    });


});