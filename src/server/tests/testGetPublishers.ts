import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ENDPOINT = process.env.ENDPOINT;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

export interface Publisher {
    publisher: string;
}

export async function getPublishers(): Promise<Publisher[]> {
    // Simulate fetching publishers from an API or database
    const publishers = [
        { publisher: 'Publisher1' },
        { publisher: 'Publisher2' },
        { publisher: 'Publisher3' },
    ];
    return publishers;
}

describe('getPublishers', () => {
    it('should return a list of publishers', async () => {
        const publishers: Publisher[] = await getPublishers();
        
        // Define the expected output
        const expectedPublishers: Publisher[] = [
            { publisher: 'Publisher1' },
            { publisher: 'Publisher2' },
            { publisher: 'Publisher3' },
        ];

        // Assertions to check if the function returns the correct data
        expect(publishers).toEqual(expectedPublishers);
        expect(publishers.length).toBe(3);
        expect(publishers[0]).toHaveProperty('publisher');
    });
});
