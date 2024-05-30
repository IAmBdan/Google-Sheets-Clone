import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ENDPOINT = process.env.ENDPOINT;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const auth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

async function createSheet(publisher: string, sheet: string): Promise<void> {
    //TODO: figure out how to test this
}