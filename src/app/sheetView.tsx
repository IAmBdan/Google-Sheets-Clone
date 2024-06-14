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

// Function to determine the endpoint based on the URL
const getEndpoint = (url: string | undefined) => {
  if (url === "https://husksheets.fly.dev/api/v1") {
    return "getUpdatesForPublished";
  } else if (url === "http://localhost:3000/api/v1") {
    return "getUpdatesForSubscription";
  }
  return "";
};

// Determine the endpoint using the URL
const endpoint = getEndpoint(url);

/**
 * Renders a sheet grid and syncs updates with the server.
 * Provides buttons for manually fetching and saving changes.
 * @param sheetName The name of the sheet to be displayed.
 * @param publisher The publisher of the sheet.
 */
export default function SheetView({
  sheetName,
  publisher,
}: {
  sheetName: string;
  publisher: string;
}) {
  const [sheet, setSheet] = useState<Sheet | undefined>();

  /**
   * Fetches the sheet data from the server.
   */
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

  /**
   * Saves the changes to the server.
   */
  const saveChanges = async () => {
    if (sheet) {
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
    }
  };

  // Fetch sheet data when the component is first rendered or when sheetName or publisher changes
  useEffect(() => {
    void fetchSheets();
  }, [publisher, sheetName]);

  return (
    <main className="flex h-full flex-col">
      {/* Buttons for fetching and saving changes */}
      <div className="flex justify-between mb-4">
        <button
          onClick={fetchSheets}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Changes
        </button>
        <button
          onClick={saveChanges}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </div>
      {/* Render the grid if sheet data is available */}
      {sheet && <Grid sheet={sheet} />}
    </main>
  );
}
