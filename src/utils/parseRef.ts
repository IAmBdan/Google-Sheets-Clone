
import { Ref } from "types/Ref";

export function parseRef(ref: string): Ref {
    const refPattern = /^\$([A-Za-z]+)(\d+)$/;
    const match = ref.match(refPattern);
    if (!match || !match[1] || !match[2]) {
        throw new Error(`Invalid ref: ${ref}`);
    }

    const colStr = match[1];
    const rowStr = match[2];


    return {
        dollar: "$",
        col: colStr.toUpperCase(),
        row: parseInt(rowStr, 10),
    };
}