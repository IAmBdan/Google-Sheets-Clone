import { Cell } from "./cell";


export interface Sheet {
    [ref: string]: Cell;
}

