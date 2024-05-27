
import { Term } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/types/term";

export function parseTerm(termStr: string): Term {
    
if (termStr.startsWith('=')) {//checks if its a formula
  return { formula: termStr }
}

if (termStr.startsWith('"') && termStr.endsWith('"')) {//checks if its a string
  return termStr.slice(1, -1).replace(/\\"/g, '"');
}

const num = parseFloat(termStr); //checks if its a number

if (!isNaN(num)) {
  return num;
}

throw new Error(`Invalid term: ${termStr}`); //if its none of the above, its invalid
}
