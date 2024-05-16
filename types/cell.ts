import { Formula } from './formula';

export interface Cell {
    value: string | number | Formula | null;
}