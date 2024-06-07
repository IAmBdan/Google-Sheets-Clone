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
  const value = sheet.getCell(cellRef).getValue();

  const stringValue =
    typeof value === "number"
      ? String(value)
      : typeof value === "string"
        ? value
        : value?.formula
          ? value?.formula
          : "";

  return <input className="border border-black" value={stringValue} />;
}
