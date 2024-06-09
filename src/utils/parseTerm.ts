//Brian Daniels
import { Term } from "/Users/bdan/Desktop/Computer Engineering/computer-serve-code/types/term";

// Parses a term string into a Term object with a number, string, or formula
export function parseTerm(input: string): Term {
  input = input.trim();

  // Check if it's a number (integer or floating point)
  if (/^-?\d+(\.\d+)?$/.test(input)) {
      return parseFloat(input);
  }

  // Check if it's a double-quote-delimited string (with possible escaped quotes)
  if (/^".*"$/.test(input)) {
      // Remove the outer quotes and handle escaped quotes
      const str = input.slice(1, -1).replace(/\\"/g, '"');
      return str;
  }

  // If it starts with "=", it's a formula
  if (input.startsWith("=")) {
      return { formula: input.slice(1) };
  }

  throw new Error(`Invalid term: ${input}`);
}
