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
  const [isEditing, setIsEditing] = useState(false);

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

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    let parsedValue: Term;

    if (newValue === "") {
      parsedValue = null;
    } else {
      parsedValue = isNaN(Number(newValue)) ? newValue : Number(newValue);
    }

    sheet.setCell(cellRef, parsedValue);
    setValue(parsedValue);

    if (newValue.startsWith('=')) {
      sheet.evaluateCellFormula(cellRef);
    }
  };

  const getCellValueForDisplay = () => {
    if (typeof value === "object" && value !== null && "formula" in value) {
      try {
        const result = sheet.evaluateCellFormula(cellRef);
        return typeof result === "number"
          ? String(result)
          : typeof result === "string"
          ? result
          : "";
      } catch (error) {
        console.error(`Error evaluating formula for ${cellRef.toString()}:`, error);
        return "ERROR";
      }
    }

    return typeof value === "number"
      ? String(value)
      : typeof value === "string"
      ? value
      : "";
  };

  const displayValue = isEditing
    ? (typeof value === "object" && value !== null && "formula" in value)
      ? value.formula
      : value ?? ''
    : getCellValueForDisplay();

  return (
    <input
      className="border border-black"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
