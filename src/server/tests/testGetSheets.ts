import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ENDPOINT = process.env.ENDPOINT;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

interface Sheet {
    id: string;
    name: string;
    // Add other fields as necessary
}

// Define the function to get sheets
async function getSheets(publisher: string): Promise<Sheet[]> {
    const examplePayload = {
        "publisher": publisher,
    };

    try {
        const response = await axios.post(`${ENDPOINT}/getSheets`, examplePayload, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Request failed: ${error.response?.status ?? error.message}`);
        } else if (error instanceof Error) {
            throw new Error(`Request failed: ${error.message}`);
        }
    }
}

// Main function to invoke getSheets and log the result
async function main() {
    try {
        const publisher = 'alice';
        const sheets = await getSheets(publisher); // Properly await the promise
        console.log('Sheets:', sheets);
    } catch (error) {
        console.error('Error:', (error as Error).message);
    }
}

// Invoke the main function and handle any unhandled rejections
main().catch(error => {
    console.error('Unhandled error:', error);
});