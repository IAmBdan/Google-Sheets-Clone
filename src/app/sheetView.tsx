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

const getEndpoint = (url: string | undefined) => {
  if (url === "https://husksheets.fly.dev/api/v1") {
    return "getUpdatesForPublished";
  } else if (url === "http://localhost:3000/api/v1") {
    return "getUpdatesForSubscription";
  }
  return "";
};

const endpoint = getEndpoint(url);

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
        `${url}/${endpoint}`,
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

      if ("payload" in response.data.value) {
        response.data.value.payload.forEach((update: string) => {
          sheet.multiUpdate(parseMultipleUpdate(update, "\n"));
        });
      } else {
        response.data.value.forEach((update: { payload: string }) => {
          console.log("Server response data", response.data.value);
          if (update.payload != "") {
            sheet.multiUpdate(parseMultipleUpdate(update.payload, "\n"));
          }
        });
      }

      setSheet(sheet);
    };

    void fetchSheets();
  }, [publisher, sheetName]);

  useEffect(() => {
    if (sheet) {
      // on each interval, show a popup message saying saved
      const interval = setInterval(async () => {
        const response = await axios.post(
          `${url}/${endpoint}`,
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

        if ("payload" in response.data.value) {
          if (response.data.value.payload.length != 0) {
            response.data.value.payload.forEach((update: string) => {
              sheet.multiUpdate(parseMultipleUpdate(update, "\n"));
            });
          }
        } else {
          if (response.data.value.length != 0) {
            console.log("Server response data", response.data.value);
            response.data.value.forEach((update: { payload: string }) => {
              if (update.payload != "") {
                sheet.multiUpdate(parseMultipleUpdate(update.payload, "\n"));
              }
            });
          }
        }

        const updates = sheet.generateUpdate();
        console.log("our updates", updates
          .map(
            ({ ref, term }) => `${ref.toString()} "${term?.toString()}"`,
          )
          .join("\n"),);

          
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
                .join("\n") + "\n",
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
