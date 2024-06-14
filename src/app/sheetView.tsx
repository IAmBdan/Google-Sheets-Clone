/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import Grid from "./grid";
import { useState } from "react";
import { Sheet } from "../classes/sheets";
import { Publisher } from "../classes/publisher";
import { useEffect } from "react";
import { parseMultipleUpdate } from "../utils/parseMultipleUpdate";
import axios from "axios";
import process from "process";

const url = process.env.NEXT_PUBLIC_HUSKSHEET_URL;

/**
 * Renders a sheet grid and syncs updates with the server.
 * @author Brooke Chalmers
 */
export default function SheetView({
  sheetName,
  publisher,
}: {
  sheetName: string;
  publisher: string;
}) {
  const [sheet, setSheet] = useState<Sheet | undefined>();

  useEffect(() => {
    const fetchSheets = async () => {
      const response = await axios.post(
        `${url}/getUpdatesForSubscription`,
        {
          sheet: sheetName,
          publisher: publisher,
          id: 0,
        },
        {
          auth: {
            username: "team19",
            password: "HDqSU5L28!;X$OzA",
          },
        },
      );

      console.log(response.data.value);

      const sheet = new Sheet(
        26,
        100,
        sheetName,
        new Publisher(publisher, 0),
        [],
      );

      response.data.value.payload.forEach((update: string) => {
        sheet.multiUpdate(parseMultipleUpdate(update, "\n"));
      });

      setSheet(sheet);
    };

    void fetchSheets();
  }, [publisher, sheetName]);

  useEffect(() => {
    if (sheet) {
      // on each interval, show a popup message saying saved
      const interval = setInterval(async () => {
        const response = await axios.post(
          `${url}/getUpdatesForSubscription`,
          {
            sheet: sheetName,
            publisher: publisher,
            id: 0,
          },
          {
            auth: {
              username: "team19",
              password: "HDqSU5L28!;X$OzA",
            },
          },
        );

        console.log(response.data);

        if (response.data.value.payload.length != 0) {
          response.data.value.payload.forEach((update: string) => {
            sheet.multiUpdate(parseMultipleUpdate(update, "\n"));
          });
        }

        const updates = sheet.generateUpdate();

        if (updates.length) {
          const response = await axios.post(
            `${url}/updateSubscription`,
            {
              sheet: sheetName,
              publisher: publisher,
              payload: updates
                .map(
                  ({ ref, term }) => `${ref.toString()} "${term?.toString()}"`,
                )
                .join("\n"),
            },
            {
              auth: {
                username: "team19",
                password: "HDqSU5L28!;X$OzA",
              },
            },
          );

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
