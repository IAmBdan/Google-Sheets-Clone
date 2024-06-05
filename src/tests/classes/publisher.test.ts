
import { Publisher } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/publisher"
import { Sheet } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/sheets";

describe('Publisher', () => {
   const publisher1Brian = new Publisher('Brian', 1, []); //no sheets
   const onebyonesheet = new Sheet(1, 1, '1x1 Sheet', publisher1Brian, []); //no shared users
   const publisher2Alan = new Publisher('Alan', 2, [onebyonesheet]); //subbed to Alans
   console.log(publisher2Alan.getSheets());
   console.log(onebyonesheet.getSharedUsers());
   
   onebyonesheet.addSharedUser(publisher2Alan);
   const twobytwosheet = new Sheet(2, 2, '2x2 Sheet', publisher2Alan, [publisher2Alan]); //subbed to Alans



    test('invalid constructor', () => {
        expect(() => new Publisher('br!an', 10, [onebyonesheet])).toThrow('Invalid name');
        expect(() => new Publisher('brian', -10, [onebyonesheet])).toThrow('Invalid id');
        expect(() => new Publisher('#$%%^^', 15, [onebyonesheet])).toThrow('Invalid name');
        expect(() => new Publisher('brian', NaN, [onebyonesheet])).toThrow('Invalid id');
        expect(() => new Publisher('brian', Infinity, [onebyonesheet])).toThrow('Invalid id');
        expect(() => new Publisher('brian', -Infinity, [onebyonesheet])).toThrow('Invalid id'); 
    });

    test('valid constructor', () => {
        expect(publisher1Brian.getName()).toBe('Brian');
        expect(publisher1Brian.getId()).toBe(1);
        expect(publisher1Brian.getSheets()).toEqual([]);
        expect(publisher2Alan.getName()).toBe('Alan');
        expect(onebyonesheet.getSharedUsers()).toEqual([publisher2Alan]);
        expect(publisher2Alan.getId()).toBe(2);
        expect(publisher2Alan.getSheets()).toEqual([onebyonesheet]);
    });

});