import { useEffect, useState } from "react";
import Ref from "~/classes/ref";
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
      setValue(sheet.getCell(cellRef).getValue());
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

  return (
    <input
      className="border border-black"
      value={stringValue}
      onChange={(e) => {
        sheet.setCell(cellRef, e.currentTarget.value);
      }}
    />
  );
}
