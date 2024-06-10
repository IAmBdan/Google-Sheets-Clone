import { Publisher } from './publisher'; 
import { Sheet } from './sheets';
// class that will handle the graph of sheets and publishers using ids to locate them
//Brian Daniels

// SheetGraphManager class that manages the relationships between sheets and publishers
export class SheetGraphManager {

    private sheets: Map<number, Sheet>;  // sheet id to sheet
    private publishers: Map<number, Publisher>; // publisher id to publisher
    private sheetPublisherMap: Map<number, number>; // sheet id to publisher id
    private sharedUsersMap: Map<number, number[]>; // publisher id to shared users ids

    /**
     * Sheets (sheets Map):

Key: sheetId (number)
Value: Sheet instance
Publishers (publishers Map):

Key: publisherId (number)
Value: Publisher instance
Sheet-Publisher Relationships (sheetPublisherMap Map):

Key: sheetId (number)
Value: publisherId (number)
Shared Users for Sheets (sharedUsersMap Map):

Key: sheetId (number)
Value: Array of publisherId (number)
     */

    constructor() {
        this.sheets = new Map();
        this.publishers = new Map();
        this.sheetPublisherMap = new Map();
        this.sharedUsersMap = new Map();
    }

    //add a publisher to the map
    addPublisher(publisher: Publisher): void {
        if (this.publishers.has(publisher.getId())) {
            throw new Error("Publisher already exists");
        }
        this.publishers.set(publisher.getId(), publisher);
    }

    //remove a publisher from the map
    removePublisher(publisherId: number): void {
        if (!this.publishers.has(publisherId)) {
            throw new Error("Publisher not found");
        }
        
        for (const [sheetId, pubId] of this.sheetPublisherMap) {
            if (pubId === publisherId) {
                
                this.sheets.delete(sheetId);
                this.sheetPublisherMap.delete(sheetId);
                this.sharedUsersMap.delete(sheetId);
            }
        }
        this.publishers.delete(publisherId);
        
    }

    //add a sheet to the map with a publisher and shared users
    addSheet(sheet: Sheet, publisher: Publisher, sharedUsers: Publisher[] = []): void {
        if (this.sheets.has(sheet.getId())) {
            throw new Error("Sheet already exists");
        }
        if (!this.publishers.has(publisher.getId())) {
            throw new Error("Publisher not found");
        }
    
        this.sheets.set(sheet.getId(), sheet);
        this.sheetPublisherMap.set(sheet.getId(), publisher.getId());
        this.sharedUsersMap.set(sheet.getId(), sharedUsers.map(user => user.getId()));
    }

    //remove a sheet from the map using id
    removeSheet(sheetId: number): void {
        if (!this.sheets.has(sheetId)) {
            throw new Error("Sheet not found");
        }
        //removes the sheet
        this.sheets.delete(sheetId);
        this.sheetPublisherMap.delete(sheetId);

        // Remove the shared users for the sheet, might not need, need to test
        this.sharedUsersMap.delete(sheetId);
    }

    //get a sheet from the map using id
    getSheet(sheetId: number): Sheet | undefined {
        if (!this.sheets.has(sheetId)){
        return undefined; }
        else {
            return this.sheets.get(sheetId);
        }
        
    }

    //get a publisher from the map using id
    getPublisher(publisherId: number): Publisher | undefined {
       if (!this.publishers.has(publisherId)) 
        {return undefined; }
        else  {
            return this.publishers.get(publisherId);
        }   
    }

    //get the publisher for a sheet
    getPublisherForSheet(sheetId: number): Publisher | undefined {
        if (this.sheets.has(sheetId)) {
           
        }

        const publisherId = this.sheetPublisherMap.get(sheetId);
        return publisherId !== undefined ? this.publishers.get(publisherId) : undefined;
    
}

    //get the shared users for a sheet
    getSharedUsersForSheet(sheetId: number): Publisher[] {
        const sharedUserIds = this.sharedUsersMap.get(sheetId);
        return sharedUserIds !== undefined ? sharedUserIds.map(userId => this.publishers.get(userId)!) : [];
    }

    //add a shared user to a sheet
    addSharedUserToSheet(sheetId: number, sharedUser: Publisher): void {
        if (!this.sheets.has(sheetId)) {
            throw new Error("Sheet not found");
        }
        if (!this.publishers.has(sharedUser.getId())) {
            throw new Error("Shared user not found");
        }
        const sharedUsers = this.sharedUsersMap.get(sheetId);
        if (sharedUsers === undefined) {
            throw new Error("Sheet not found");
        }
        sharedUsers.push(sharedUser.getId());
    }

    //remove a shared user from a sheet
    removeSharedUserFromSheet(sheetId: number, sharedUserId: number): void {
        if (!this.sheets.has(sheetId)) {
            throw new Error("Sheet not found");
        }
        const sharedUsers = this.sharedUsersMap.get(sheetId);
        if (sharedUsers === undefined) {
            throw new Error("Sheet not found");
        }
        const index = sharedUsers.indexOf(sharedUserId);
        if (index === -1) {
            throw new Error("Shared user not found");
        }
        sharedUsers.splice(index, 1);
    }

    //get all the sheets for a publisher
    getSheetsForPublisher(publisherId: number): Sheet[] {
        const sheets: Sheet[] = [];
        for (const [sheetId, pubId] of this.sheetPublisherMap) {
            if (pubId === publisherId) {
                sheets.push(this.sheets.get(sheetId)!);
            }
        }
        return sheets;
    }

    //add a sheet to a publisher
    addSheetToPublisher(sheetId: number, publisherId: number): void {
        if (!this.sheets.has(sheetId) || !this.publishers.has(publisherId)) {


        this.sheetPublisherMap.set(sheetId, publisherId);
        //add the shared users to the map
        const sheet = this.getSheet(sheetId);
        const sharedUsers = this.getSharedUsersForSheet(sheetId);
        if (sheet) {
            //add the shared users to the map 
            this.sharedUsersMap.set(sheetId, sharedUsers.map(user => user.getId())); 
            //add the sheet to the publisher
        }
    }
    }

    

    //remove a sheet from a publisher
    removeSheetFromPublisher(sheetId: number): void {
        if (!this.sheets.has(sheetId)) {
            throw new Error("Sheet not found");
        }
        this.sheetPublisherMap.delete(sheetId);
        this.sharedUsersMap.delete(sheetId);
    }




}