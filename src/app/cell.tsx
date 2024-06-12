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
  const [cellData, setCellData] = useState(() => {
    const cell = sheet.getCell(cellRef);
    const value = cell.getValue();
    return {
      value,
      formula: isFormula(value) ? value.formula : "",
      computedValue: cell.getComputedValue() || "",
    };
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const listener = () => {
      const cell = sheet.getCell(cellRef);
      const value = cell.getValue();
      setCellData({
        value,
        formula: isFormula(value) ? value.formula : "",
        computedValue: cell.getComputedValue() || "",
      });
    };

    sheet.addListener(listener);

    return () => {
      sheet.removeListener(listener);
    };
  }, [sheet, cellRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    let parsedValue: Term;

    if (newValue === "") {
      parsedValue = null;
    } else {
      parsedValue = isNaN(Number(newValue)) ? newValue : Number(newValue);
    }

    sheet.setCell(cellRef, parsedValue, true);
    setCellData((prevData) => ({
      ...prevData,
      value: parsedValue,
      formula: newValue.startsWith("=") ? newValue : prevData.formula,
    }));

    if (newValue.startsWith("=")) {
      sheet.evaluateCellFormula(cellRef);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <input
      className="border border-black"
      value={isEditing ? cellData.formula : String(cellData.computedValue)}
      onChange={handleChange}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    />
  );
}

// Type guard to check if a value is a formula object
function isFormula(value: any): value is { formula: string } {
  return typeof value === "object" && value !== null && "formula" in value;
}