import { useEffect, useState } from "react";
import { Ref } from "~/classes/ref";
import { Term } from "~/types/term";
import { Sheet } from "~/classes/sheets";

/**
 * Renders a single cell in the grid.
 */
export default function Cell({
  cellRef,
  sheet,
}: {
  cellRef: Ref;
  sheet: Sheet;
}) {
  const [value, setValue] = useState(() => sheet.getCell(cellRef).getValue());
  const [referenceMap, setReferenceMap] = useState(new Map<string, Ref[]>());

  useEffect(() => {
    const listener = () => {
      const newValue = sheet.getCell(cellRef).getValue();
      setValue(newValue);
    };

    sheet.addListener(listener);

    return () => {
      sheet.removeListener(listener);
    };
  }, [sheet, cellRef]);

  const stringValue =
    typeof value === "number"
      ? String(value)
      : typeof value === "string"
        ? value
        : value?.formula
          ? value?.formula
          : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    let parsedValue: Term;

    if (newValue === "") {
      parsedValue = null;
    } else {
      parsedValue = isNaN(Number(newValue)) ? newValue : Number(newValue);
    }

    sheet.setCell(cellRef, parsedValue, true);
    setValue(parsedValue);

    if (newValue.startsWith("=")) {
      console.log(cellRef);
      const references = parseCellReferences(newValue);
      console.log("References", references);
      references.forEach(ref => {
        if (!referenceMap.has(ref)) {
          referenceMap.set(ref, []);
        }
        if (!referenceMap.get(ref)?.includes(cellRef)) {
          referenceMap.get(ref)?.push(cellRef);
        }
      });
      console.log("ReferenceMap", referenceMap);
      sheet.evaluateCellFormula(cellRef);
    }
  };

  return (
    <input
      className="border border-black"
      value={stringValue}
      onChange={handleChange}
    />
  );
}

// Parse cell references from formula
function parseCellReferences(formula: string): string[] {
  // Regular expression to match cell references
  const cellReferencePattern = /\$?[A-Z]+\$?\d+/g;
  const matches = formula.match(cellReferencePattern);
  return matches ? matches : [];
}
