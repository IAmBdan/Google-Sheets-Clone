//all tests work

import { Publisher } from "../../classes/publisher"
import { Sheet } from "../../classes/sheets";
//Brian Daniels
describe('Publisher', () => {
   const publisher1Brian = new Publisher('Brian', 1,); //no sheets
   const publisher2Alan = new Publisher('Alan', 2,); //subbed to Alans


    test('invalid constructor', () => { //test invalid constructors
        expect(() => new Publisher('br!an', 10 )).toThrow('Invalid name');
        expect(() => new Publisher('brian', -10 )).toThrow('Invalid id');
        expect(() => new Publisher('#$%%^^', 15 )).toThrow('Invalid name');
        expect(() => new Publisher('brian', NaN )).toThrow('Invalid id');
        expect(() => new Publisher('brian', Infinity )).toThrow('Invalid id');
        expect(() => new Publisher('brian', -Infinity )).toThrow('Invalid id'); 
    });

    test('valid constructor', () => { //test valid constructors
        expect(publisher1Brian.getName()).toBe('Brian');
        expect(publisher1Brian.getId()).toBe(1);
        expect(publisher2Alan.getName()).toBe('Alan');
    });

    test('setName', () => { //test setName
        publisher1Brian.setName('Alan');
        expect(publisher1Brian.getName()).toBe('Alan');
        publisher1Brian.setName('Brian d');
        expect(publisher1Brian.getName()).toBe('Brian d');
    });

    test('setId', () => { //test setId
        publisher1Brian.setId(2);
        expect(publisher1Brian.getId()).toBe(2);
        publisher1Brian.setId(0);
        expect(publisher1Brian.getId()).toBe(0);
    });

    test('invalid setName', () => { //test invalid setName
        expect(() => publisher1Brian.setName('')).toThrow('Invalid name');
    });

    test('invalid setId', () => { //test invalid setId
        publisher1Brian.setId(1);
        expect(() => publisher1Brian.setId(NaN)).toThrow('Invalid id');
        expect(() => publisher1Brian.setId(Infinity)).toThrow('Invalid id');
        expect(() => publisher1Brian.setId(-Infinity)).toThrow('Invalid id');
        expect(() => publisher1Brian.setId(-10)).toThrow('Invalid id');
        expect(publisher1Brian.getId()).toBe(1)
    });

    test('equals', () => { //test equals
        expect(publisher1Brian.equals(publisher2Alan)).toBe(false);
        expect(publisher1Brian.equals(publisher1Brian)).toBe(true);
    });
});