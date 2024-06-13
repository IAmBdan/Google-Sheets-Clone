/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useRef, useState } from "react";
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
  const [draftValue, setDraftValue] = useState("");
  const [value, setValue] = useState(() => sheet.getCell(cellRef).getValue());
  const [isFocused, setIsFocused] = useState(false);

  const displayValue =
    typeof value === "number"
      ? String(value)
      : typeof value === "string"
        ? value
        : value?.formula
        ? value?.value
          : "";

  const editValue =
    typeof value === "number"
      ? String(value)
      : typeof value === "string"
        ? value
        : value?.formula
          ? value?.formula
          : "";

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

  const handleChange = (newValue: string) => {
    let parsedValue: Term;

    if (newValue.startsWith("=")) {
      parsedValue = { formula: newValue };
    } else if (newValue === "") {
      parsedValue = null;
    } else {
      parsedValue = isNaN(Number(newValue)) ? newValue : Number(newValue);
    }

    sheet.setCell(cellRef, parsedValue, true);
    setValue(parsedValue);
  };

  return (
    <input
      className="border border-black"
      value={isFocused ? draftValue : displayValue}
      onChange={(e) => setDraftValue(e.currentTarget.value)}
      onFocus={() => {
        setIsFocused(true);
        setDraftValue(editValue);
      }}
      onBlur={() => {
        setIsFocused(false);
        handleChange(draftValue);
      }}
    />
  );
}
