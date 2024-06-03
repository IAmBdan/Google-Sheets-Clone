
import { singleUpdate } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/types/singleUpdate";
import { parseTerm } from "./parseTerm";
import { parseRef } from "./parseRef";


export function parseSingleUpdate(line: string): singleUpdate {
    const [refStr, ...termParts] = line.trim().split(" ");
    const termStr = termParts.join(" ");
    if (!refStr) {
        throw new Error("Invalid input line: missing reference string");
    }
    const ref = parseRef(refStr); 
    const term = parseTerm(termStr);
    return { ref, term };
}
 