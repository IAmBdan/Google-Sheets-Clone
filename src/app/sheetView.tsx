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

// Get the URL from environment variables
const url = process.env.NEXT_PUBLIC_HUSKSHEET_URL;

/**
 * Determines the endpoint based on the provided URL.
 * @param url The URL to determine the endpoint for.
 * @returns The appropriate endpoint based on the URL.
 */
const getEndpoint = (url: string | undefined) => {
  if (url === "https://husksheets.fly.dev/api/v1") {
    return "getUpdatesForPublished";
  } else if (url === "https://localhost:3000/api/v1") {
    return "getUpdatesForSubscription";
  }
  return "";
};

// Determine the endpoint using the URL
const endpoint = getEndpoint(url);

/**
 * Renders a sheet grid and syncs updates with the server.
 * @param sheetName The name of the sheet to be displayed.
 * @param publisher The publisher of the sheet.
 * @author Brooke Chalmers
 */
export default function SheetView({
  sheetName,
  publisher,
}: {
  sheetName: string;
  publisher: string;
}) {
  // State to hold the sheet data
  const [sheet, setSheet] = useState<Sheet | undefined>();

  // Effect to fetch sheet data when component mounts or when sheetName/publisher changes
  useEffect(() => {
    const fetchSheets = async () => {
      // Fetch sheet updates from the server
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

      // Create a new Sheet instance
      const sheet = new Sheet(
        26,
        100,
        sheetName,
        new Publisher(publisher, 0),
        [],
      );

      // Update the sheet with the fetched data
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

      // Set the sheet state
      setSheet(sheet);
    };

    void fetchSheets();
  }, [publisher, sheetName]);

  // Effect to periodically sync updates with the server
  useEffect(() => {
    if (sheet) {
      // Set up an interval to fetch and push updates
      const interval = setInterval(async () => {
        // Fetch sheet updates from the server
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

        // Update the sheet with the fetched data
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

        // Generate updates from the sheet and push them to the server
        const updates = sheet.generateUpdate();
        console.log(
          "our updates",
          updates
            .map(({ ref, term }) => `${ref.toString()} "${term?.toString()}"`)
            .join("\n"),
        );

        if (updates.length) {
          const response = await axios.post(
            `${url}/updateSubscription`,
            {
              sheet: sheetName,
              publisher: publisher,
              payload:
                updates
                  .map(
                    ({ ref, term }) =>
                      `${ref.toString()} "${term?.toString()}"`,
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

      // Clear the interval when the component is unmounted
      return () => clearInterval(interval);
    }
  }, [sheet, publisher, sheetName]);

  return (
    <main className="flex h-full flex-col">
      {/* Render the grid if sheet data is available */}
      {sheet && <Grid sheet={sheet} />}
    </main>
  );
}
