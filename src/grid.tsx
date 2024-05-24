import { Fragment } from "react";
import Cell from "./cell";

export default function Grid({
  numColumns,
  numRows,
}: {
  numColumns: number;
  numRows: number;
}) {
  return (
    <div
      className="grid h-0 w-full flex-grow overflow-x-scroll overflow-y-scroll"
      style={{
        gridTemplateColumns: `1fr repeat(${numColumns}, 1fr)`,
        gridTemplateRows: `1fr repeat(${numRows + 1}, 1fr)`,
      }}
    >
      <span className="border-b border-r border-gray-600 bg-gray-100" />
      {Array.from({ length: numColumns }, (_, i) => (
        <span
          key={i}
          className="border-l border-r border-gray-600 bg-gray-100 text-center"
        >
          {String.fromCharCode("A".charCodeAt(0) + i)}
        </span>
      ))}

      {Array.from({ length: numRows }, (_, i) => (
        <Fragment key={i}>
          <span
            key={i}
            className="border-b border-t border-gray-600 bg-gray-100 text-center"
          >
            {i + 1}
          </span>

          {Array.from({ length: numColumns }, (_, j) => (
            <Cell key={j} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
