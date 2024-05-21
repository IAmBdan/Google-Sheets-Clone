import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ENDPOINT = process.env.ENDPOINT;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

export interface Argument {
    publisher: string;
    sheet: string;
    id: number;
}

async function updateSubscription({publisher, sheet, id}: Argument): Promise<void> {
    //
    
}