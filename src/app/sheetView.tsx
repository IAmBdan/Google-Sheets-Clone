/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import Grid from "./grid";
import { useState } from "react";
import { Sheet } from "../classes/sheets";
import { Publisher } from "../classes/publisher";
import { useEffect } from "react";
import { parseMultipleUpdate } from "~/utils/parseMultipleUpdate";
import axios from "axios";

export default function SheetView({ sheetName, publisher }: { sheetName: string; publisher: string }) {
  const [sheet, setSheet] = useState<Sheet | undefined>();

  useEffect(() => {
    const fetchSheets = async () => {

        const response = await axios.post("/api/v1/getUpdatesForSubscription", {
          sheet: sheetName,
          publisher: publisher,
          id: 0,
        });

        console.log(response.data.value);

        const sheet = new Sheet(26, 100, sheetName, new Publisher(publisher, 0), []);

        response.data.value.payload.forEach((update: string) => {
          sheet.multiUpdate(parseMultipleUpdate(update, "\n"));
        })

        setSheet(sheet);
    };

    void fetchSheets();
  }, [publisher, sheetName]);

  useEffect(() => {
    if (sheet) {
      // on each interval, show a popup message saying saved
      const interval = setInterval(async () => {
        const response = await axios.post("/api/v1/getUpdatesForSubscription", {
          sheet: sheetName,
          publisher: publisher,
          id: 0,
        });

        console.log(response.data);

        response.data.value.payload.forEach((update: string) => {
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
