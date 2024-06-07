import axios from "axios";
import { useState, useEffect } from "react";

export default function LandingPage() {
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
    <div className="container mx-auto p-4">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            className="rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
          >
            <h2 className="mb-2 text-xl font-bold">{sheet.name}</h2>
            <button
              onClick={() => deleteSheet(sheet.id)}
              className="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-1 text-white transition hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
