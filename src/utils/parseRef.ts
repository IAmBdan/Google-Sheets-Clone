/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Ref } from "../classes/ref"


// Parses a reference string into a Ref object with a column and row
export function parseRef(ref: string): Ref {
    const refPattern = /^\$([A-Za-z]+)(\d+)$/;
    const match = ref.match(refPattern);
    if (!match || !match[1] || !match[2]) {
        throw new Error(`Invalid ref: ${ref}`);
    }

    const colStr = match[1];
    const rowStr = match[2];

    const parsedRef: Ref = new Ref(colStr.toUpperCase(), parseInt(rowStr, 10));
    
    return parsedRef;
}

export default parseRef;