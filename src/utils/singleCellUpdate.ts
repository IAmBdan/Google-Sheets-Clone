//Brian Daniels
import type { singleUpdate } from "../types/singleUpdate";
import { parseTerm } from "./parseTerm";
import { parseRef } from "./parseRef";


// Parses a single cell update string into a singleUpdate object with a ref and term
export function parseSingleCellUpdate(line: string): singleUpdate {
    const [refStr, ...termParts] = line.trim().split(" ");
    const termStr = termParts.join(" ");
    if (refStr === "" || termStr === "") {
        throw new Error(`Invalid input line: ${line}`);
    }
    const ref = parseRef(refStr ?? ''); // Provide a default value for refStr
    
    const term = parseTerm(termStr);
    return { ref, term };
}
 