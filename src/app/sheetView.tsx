"use client";

import Grid from "./grid";
import Header from "./header";
import InputLine from "./inputline";
import { Ref } from "~/classes/ref";
import { useState } from "react";
import { Sheet } from "~/classes/sheets";
import { Publisher } from "~/classes/publisher";

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
      <Header sheet={sheet} />
      <InputLine />
      <Grid sheet={sheet} />
    </main>
  );
}
