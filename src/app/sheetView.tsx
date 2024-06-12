"use client";

import Grid from "./grid";
import { Ref } from "../classes/ref";
import { useState } from "react";
import { Sheet } from "../classes/sheets";
import { Publisher } from "../classes/publisher";
import { useEffect } from "react";
import { parseMultipleUpdate } from "~/utils/parseMultipleUpdate";
import axios from "axios";

/*
{
  ["cell": "A1", "value": "hello!",
  "cell": "A1", "value": "hello!"]
}
*/

export default function SheetView({ sheetName, publisher }: { sheetName: string; publisher: string }) {
  const [sheet, setSheet] = useState<Sheet | undefined>();

  useEffect(() => {
    const fetchSheets = async () => {

        const response = await axios.post("/api/v1/getUpdatesForSubscription", {
          sheet: sheetName,
          publisher: publisher,
          id: 0,
        });

        console.log(response.data);

        const sheet = new Sheet(26, 100, sheetName, new Publisher(publisher, 0), []);

        response.data.payload.forEach((update: string) => {
          sheet.multiUpdate(parseMultipleUpdate(update, "\n"));
        })

        setSheet(sheet);
    };

    void fetchSheets();
  }, [publisher, sheetName]);

  useEffect(() => {
    if (sheet) {
      const interval = setInterval(async () => {
        const response = await axios.post("/api/v1/getUpdatesForSubscription", {
          sheet: sheetName,
          publisher: publisher,
          id: 0,
        });

        console.log(response.data);

        response.data.payload.forEach((update: string) => {
          sheet.multiUpdate(parseMultipleUpdate(update, "\n"));
        });

        const updates = sheet.generateUpdate();

        if (updates.length) {
          const response = await axios.post("/api/v1/updateSubscription", {
            sheet: sheetName,
            publisher: publisher,
            payload: updates.map(({ ref, term }) => `${ref.toString()} "${term?.toString()}"`).join("\n"),
          });

          console.log(response);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [sheet, publisher, sheetName]);

  return (
    <main className="flex h-full flex-col">
      {sheet && <Grid sheet={sheet} />}
    </main>
  );
}
