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

    sheet.setCell(cellRef, parsedValue);
    setValue(parsedValue);

    if (newValue.startsWith('=')) {
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
