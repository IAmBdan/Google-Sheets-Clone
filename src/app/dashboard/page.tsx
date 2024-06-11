"use client";

//Landing Page
import axios from "axios";
import { useState, useEffect } from "react";

const SHEETS = [
  {
    name: "my awesome spreadsheet",
    author: "Author 1",
  },
  {
    name: "another spreadsheet",
    author: "Author 1",
  },
  {
    name: "a third spreadsheet",
    author: "Author 1",
  },
];

export default function Dashboard() {
  const [client, setClient] = useState("");
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

  const createSheet = async () => {
    try {
      const response = await axios.post("/api/v1/createSheet", {
        publisher: client,
        sheet: sheetName,
      }); // Adjust the payload as needed
      setSheets([...sheets, response.data]);
      console.log(response.data);
    } catch (error) {
      console.error("Error creating sheet:", error);
    }
  };

  const deleteSheet = async (id: number) => {
    try {
      await axios.post("/api/v1/deleteSheet", {
        publisher: client,
        sheet: sheetName,
      }); // Adjust to your actual endpoint
      setSheets(sheets.filter((sheet) => sheet.id !== id));
      console.log(`Sheet with id ${id} deleted`);
    } catch (error) {
      console.error("Error deleting sheet:", error);
    }
  };

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
          <button
            onClick={createSheet}
            className="ml-4 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Create New Sheet
          </button>
        </div>
        {SHEETS.map(({ name, author }) => (
          <a
            key={name}
            className="flex w-full flex-col rounded border border-black p-2"
            href={"/sheet"}
          >
            <h2 className="text-xl font-bold">{name}</h2>
            <span>{author}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
