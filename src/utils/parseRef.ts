
import { Ref } from "../classes/ref";

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