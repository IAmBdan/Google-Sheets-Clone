import { Cell } from "./cell";

export interface Sheet {
    title: string;
    cells: Cell[][];
}