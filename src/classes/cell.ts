//Brian Daniels
import { Ref } from "./ref";

export { Cell };
  
    // Cell class that represents a cell in a sheet
    class Cell {
        value: number | string | { formula: string } | null;
        ref?: Ref | undefined;
        refAsString?: string;

        constructor(value: number | string | { formula: string } | null, ref?: Ref | string) {
            this.value = value;
            if (ref) {
                if (typeof ref === 'string') {
                    this.setRefAsString(ref);
                    this.ref = new Ref(ref);
                } else {
                    this.setRef(ref);
                    this.refAsString = ref.toString();
                }
            }
        }

        // Getters and setters
        getValue(): number | string | { formula: string } | null {
            return this.value;
        }

        // Setters
        setValue(value: number | string | { formula: string } | null): void {
            this.value = value;
        }

        // Getters
        setRef(ref: Ref): void {
            this.ref = ref;
            this.refAsString = ref.toString();
        }
        
        //  Setters
        setRefAsString(refAsString: string): void {
            this.refAsString = refAsString;
            this.ref = new Ref(refAsString);
        }

        // Getters
        getRef(): Ref {
            if (this.ref) {
                return this.ref;
            } else {
                throw new Error("Ref is undefined");
            }
        }

        // Getters
        getRefString(): string {
            if (this.ref) {
                return this.ref.toString();
            } else {
                throw new Error("Ref is undefined");
            }
        }

        // equals method to compare two cells
        equals(cell: Cell): boolean {
            return this.value?.toString() === cell.value?.toString() && (this.ref?.toString() === cell.ref?.toString()) && this.refAsString === cell.refAsString;
        }
    }