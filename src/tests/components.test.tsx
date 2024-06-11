import { expect, describe, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import Cell from "../app/cell";
import { Ref } from "../classes/ref";
import { Sheet } from "../classes/sheets";
import { Publisher } from "../classes/publisher";
import Grid from "../app/grid";
import { numberToColumnLabel } from "../utils/numberToColumnLabel";
import SheetView from "../app/sheetView";

function makeSheet(content: string | number | { formula: string } | null) {
  const sheet = new Sheet(
    1,
    1,
    "My Sheet",
    new Publisher("Test Publisher", 1),
    [],
  );

  sheet.setCell(new Ref("$A1"), content);

  return sheet;
}

describe("Cell component", () => {
  it("renders correctly", () => {
    const sheet = makeSheet(null);

    const { container } = render(
      <Cell cellRef={new Ref("$A1")} sheet={sheet} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders text", () => {
    const sheet = makeSheet("Hello World!");

    const { container } = render(
      <Cell cellRef={new Ref("$A1")} sheet={sheet} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders numbers", () => {
    const sheet = makeSheet(42);

    const { container } = render(
      <Cell cellRef={new Ref("$A1")} sheet={sheet} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders formulas", () => {
    const sheet = makeSheet({ formula: "=SUM(2,2)" });

    const { container } = render(
      <Cell cellRef={new Ref("$A1")} sheet={sheet} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("updates the value when the cell changes", async () => {
    const sheet = makeSheet(null);

    render(<Cell cellRef={new Ref("$A1")} sheet={sheet} />);

    act(() => {
      sheet.setCell(new Ref("$A1"), "Hello World!");
    });

    expect(screen.getByDisplayValue("Hello World!")).toBeDefined();
  });
});

describe("Grid component", () => {
  it("renders correctly", () => {
    const sheet = makeSheet(null);

    const { container } = render(<Grid sheet={sheet} />);
    expect(container).toMatchSnapshot();
  });

  it("renders the column headers", () => {
    const sheet = new Sheet(
      2,
      100,
      "___",
      new Publisher("Test Publisher", 1),
      [],
    );

    render(<Grid sheet={sheet} />);

    for (let i = 1; i <= 100; i++) {
      expect(screen.getAllByText(numberToColumnLabel(i))).toBeTruthy();
    }
  });

  it("renders the row headers", () => {
    const sheet = new Sheet(
      100,
      2,
      "___",
      new Publisher("Test Publisher", 1),
      [],
    );

    render(<Grid sheet={sheet} />);

    for (let i = 1; i <= 100; i++) {
      expect(screen.getAllByText(i.toString())).toBeTruthy();
    }
  });

  it("renders the appropriate number of cells", () => {
    const sheet = new Sheet(
      13,
      17,
      "___",
      new Publisher("Test Publisher", 1),
      [],
    );

    render(<Grid sheet={sheet} />);

    expect(screen.getAllByRole("textbox")).toHaveLength(13 * 17);
  });
});

describe("SheetView component", () => {
  it("renders correctly", () => {
    const { container } = render(<SheetView />);
    expect(container).toMatchSnapshot();
  });
});
