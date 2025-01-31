import { Fragment } from "react";
import Cell from "./cell";
import { type Sheet } from "../classes/sheets";
import { Ref } from "../classes/ref";
import { numberToColumnLabel } from "../utils/numberToColumnLabel";

/**
 * Renders a grid of cells, including row and column headers.
 */
export default function Grid({ sheet }: { sheet: Sheet }) {
  const { columns, rows } = sheet.getSize();

  return (
    <div
      className="grid h-0 w-full flex-grow overflow-x-scroll overflow-y-scroll"
      style={{
        gridTemplateColumns: `1fr repeat(${columns}, 1fr)`,
        gridTemplateRows: `1fr repeat(${rows + 1}, 1fr)`,
      }}
    >
      <span className="border-b border-r border-gray-600 bg-gray-100" />
      {Array.from({ length: columns }, (_, i) => (
        <span
          key={i}
          className="border-l border-r border-gray-600 bg-gray-100 text-center"
        >
          {numberToColumnLabel(i + 1)}
        </span>
      ))}

      {Array.from({ length: rows }, (_, i) => (
        <Fragment key={i}>
          <span
            key={i}
            className="border-b border-t border-gray-600 bg-gray-100 text-center"
          >
            {i + 1}
          </span>

          {Array.from({ length: columns }, (_, j) => (
            <Cell
              key={j}
              sheet={sheet}
              cellRef={new Ref(numberToColumnLabel(j + 1), i + 1)}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
