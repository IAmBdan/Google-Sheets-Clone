"use client";

import Grid from "./grid";
import { Ref } from "../classes/ref";
import { useState } from "react";
import { Sheet } from "../classes/sheets";
import { Publisher } from "../classes/publisher";

export default function SheetView() {
  const [sheet] = useState(() => {
    const sheet = new Sheet(
      100,
      26,
      "My Spreadsheet",
      new Publisher("My Publisher", 1),
      [],
    );
    sheet.setCell(new Ref("A", 1), "hello!");
    return sheet;
  });

  return (
    <main className="flex h-full flex-col">
      {/* <Dummy /> */}
      <Grid sheet={sheet} />
    </main>
  );
}
