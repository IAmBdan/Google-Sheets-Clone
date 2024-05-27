
import { singleUpdate } from "types/singleUpdate";
import { parseSingleUpdate } from "./parseSingleUpdate";


export function parseMultipleUpdate(updateStr: string, newline: string): singleUpdate[] {
    const lines = updateStr.trim().split(newline);
    return lines.map(parseSingleUpdate);
}