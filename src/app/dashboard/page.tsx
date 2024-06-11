"use client";

//Landing Page
import axios from "axios";
import { useState, useEffect } from "react";

export default function Dashboard() {
  // CIRCLE BACK TO THIS
  const [client, setClient] = useState("chris");
  const [sheetName, setSheetName] = useState("");
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await axios.post("/api/v1/getSheets", {
          publisher: client,
        });
        setSheets(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching sheets:", error);
      }
    };

    void fetchSheets();
  }, []);

  return (
    <div className="mx-auto my-16 flex max-w-sm flex-col gap-4">
      <div>
        <h1 className="text-center text-2xl">Spreadsheets</h1>
        <div className="mb-4">
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Enter client name"
            className="w-full rounded-md border p-2"
          />
        </div>
        {sheets.map(({ publisher, sheet }) => (
          <a
            key={publisher}
            className="flex w-full flex-col rounded border border-black p-2"
            href={"/sheet"}
          >
            <h2 className="text-xl font-bold">{sheet}</h2>
            <span>{publisher}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
