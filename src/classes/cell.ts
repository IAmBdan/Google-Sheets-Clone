
export { Cell };
  
import { Ref } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/ref"

    class Cell {
        value: number | string | { formula: string } | null;
        ref?: Ref;
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


        getValue(): number | string | { formula: string } | null {
            return this.value;
        }

        setValue(value: number | string | { formula: string } | null): void {
            this.value = value;
        }

        setRef(ref: Ref): void {
            this.ref = ref;
            this.refAsString = ref.toString();
        }
        
        setRefAsString(refAsString: string): void {
            this.refAsString = refAsString;
            this.ref = new Ref(refAsString);
        }


        getRef(): Ref {
            if (this.ref) {
                return this.ref;
            } else {
                throw new Error("Ref is undefined");
            }
        }

        getRefString(): string {
            if (this.ref) {
                return this.ref.toString();
            } else {
                throw new Error("Ref is undefined");
            }
        }

        equals(cell: Cell): boolean {
            return this.value?.toString() === cell.value?.toString() && (this.ref?.toString() === cell.ref?.toString()) && this.refAsString === cell.refAsString;
        }
    }