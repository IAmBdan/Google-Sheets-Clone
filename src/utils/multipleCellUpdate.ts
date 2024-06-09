//Brian Daniels
import { singleUpdate } from "types/singleUpdate";
import { parseSingleCellUpdate } from "./singleCellUpdate";

// Parses a string of multiple cell updates into an array of single updates
export function parseMultipleCellUpdate(updates: string): singleUpdate[] {
    const lines = updates.trim().split('\n');
    const parsedUpdates: singleUpdate[] = lines.map(line => parseSingleCellUpdate(line.trim()));
    return parsedUpdates;
}
