"use client";

//Landing Page
import axios from "axios";
import { useState, useEffect } from "react";

export default function Dashboard() {
  // CIRCLE BACK TO THIS
  const [client, setClient] = useState("chris");
  const [sheetName, setSheetName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheets, setSheets] = useState([]);

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

  useEffect(() => {
    fetchSheets();
  }, []);

  const createSheet = async (client: string, sheetName: string) => {
    try {
      const response = await axios.post("/api/v1/createSheet", {
        publisher: client,
        name: sheetName,
      });
      // This line shouldn't be needed
      // @ts-ignore
      setSheets([...sheets, response.data]);
      console.log(response.data);
    } catch (error) {
      console.error("Error creating sheet:", error);
    }
  };

  const deleteSheet = async (client: string, sheetName: string) => {
    try {
      const response = await axios.post("/api/v1/deleteSheet", {
        publisher: client,
        name: sheetName,
      });
      setSheets(sheets.filter((sheet) => sheet !== sheetName));
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting sheet:", error);
    }
  };

  const handleCreateNewSheet = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    await createSheet(client, sheetName);
    await fetchSheets();
    setSheetName("");
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSheetName("");
  };

  return (
    <div
      style={{
        backgroundImage: "url('/background.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      className="flex items-center justify-center"
    >
      <div className="mx-auto my-16 flex max-w-sm flex-col gap-8 bg-white bg-opacity-80 p-4 rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl">{client}&apos;s Spreadsheets</h1>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleCreateNewSheet}
            className="rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Create New Sheet
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {sheets.map(({ publisher, sheet }) => (
    <div
      key={publisher}
      className="relative flex flex-col items-center justify-center rounded border border-black p-2 bg-white bg-opacity-90"
    >
      <a href={`/sheet/${publisher}/${sheet}`} className="flex-grow text-center">
        <h2 className="text-xl font-bold">{sheet}</h2>
        <span>{publisher}</span>
      </a>
      <button
        onClick={async (e) => {
          e.preventDefault();
          await deleteSheet(client, sheet);
          await fetchSheets();
        }}
        className="rounded-md bg-red-500 px-2 py-1 text-white transition hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  ))}
</div>


        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <h3 className="mb-2 text-lg font-bold">Enter New Sheet Name</h3>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Sheet name"
                className="mb-4 w-full rounded-md border p-2"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleModalClose}
                  className="mr-2 rounded-md bg-gray-300 px-4 py-2 text-gray-800 transition hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSubmit}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}