/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { type Cell } from "./cell";


export interface Sheet {
    [ref: string]: Cell;
}

