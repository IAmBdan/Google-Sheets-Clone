"use client";

import Grid from "./grid";
import Header from "./header";
import InputLine from "./inputline";
import Ref from "~/classes/ref";
import { useState } from "react";
import { Sheet } from "~/classes/sheets";

export default function SheetView() {
  const [sheet] = useState(() => {
    const sheet = new Sheet(100, 26);
    sheet.setCell(new Ref("A", 1), "hello!");
    return sheet;
  });

  return (
    <main className="flex h-full flex-col">
      {/* <Dummy /> */}
      <Header />
      <InputLine />
      <Grid sheet={sheet} />
    </main>
  );
}
