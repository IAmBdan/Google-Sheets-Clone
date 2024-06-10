//Brian Daniels
import { hasSpecialChar } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/src/utils/hasSpecialChar";

import { hasSpecialChar } from "../utils/hasSpecialChar";
export class Publisher {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    if (name === undefined || hasSpecialChar(name))
      throw new Error("Invalid name");
    this.name = name;
    if (id < 0 || id === -Infinity || id === Infinity || Number.isNaN(id)) {
      throw new Error("Invalid id");
    }
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  getId(): number {
    return this.id;
  }

  setName(name: string): void {
    if (name === "") {
      throw new Error("Invalid name");
    } else {
      this.name = name;
    }
  }

    setId(id: number): void {
        if(id < 0 || id === -Infinity || id === Infinity || Number.isNaN(id)) {
            throw new Error("Invalid id")
            
        } else {
            this.id = id;
        }
      
    }


  equals(publisher: Publisher): boolean {
    return this.name === publisher.name && this.id === publisher.id;
  }
}
