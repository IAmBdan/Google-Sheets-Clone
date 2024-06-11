"use client";

import Grid from "./grid";
import { Ref } from "../classes/ref";
import { useState } from "react";
import { Sheet } from "../classes/sheets";
import { Publisher } from "../classes/publisher";

/*
{
  ["cell": "A1", "value": "hello!",
  "cell": "A1", "value": "hello!"]
}
*/

export default function SheetView() {
  const [sheet] = useState(() => {
    const sheet = new Sheet(
      100,
      26,
      "My Spreadsheet",
      new Publisher("My Publisher", 1),
      [],
    );
    // unpack the data and set the cell values 
    sheet.setCell(new Ref("A", 1), "hello!");
    return sheet;
  });

  return (
    <main className="flex h-full flex-col">
      <Grid sheet={sheet} />
    </main>
  );
}
