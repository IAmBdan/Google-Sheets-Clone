// Purpose: Parse a string of multiple updates into an array of single updates.
//Brian Daniels
import { singleUpdate } from "~/types/singleUpdate";
import { parseSingleCellUpdate } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/utils/singleCellUpdate";


export function parseMultipleUpdate(updateStr: string, newline: string): singleUpdate[] {
    const lines = updateStr.trim().split(newline);
    return lines.map(parseSingleCellUpdate);
}