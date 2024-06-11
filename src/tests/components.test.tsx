import { expect, describe, it } from "vitest";
import { render } from "@testing-library/react";
import Cell from "../app/cell";
import { Ref } from "../classes/ref";
import { Sheet } from "../classes/sheets";
import { Publisher } from "../classes/publisher";

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
});

// const component = renderer.create(
//   <Link page="http://www.facebook.com">Facebook</Link>,
// );
// let tree = component.toJSON();
// expect(tree).toMatchSnapshot();
