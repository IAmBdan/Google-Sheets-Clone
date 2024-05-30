
export { Cell };
  
import { Ref } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/classes/ref"

    class Cell {
        value: number | string | { formula: string } | null;
        ref?: Ref;
        refAsString?: string;

        constructor(value: number | string | { formula: string } | null, ref?: string) {
            this.value = value;
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
    }