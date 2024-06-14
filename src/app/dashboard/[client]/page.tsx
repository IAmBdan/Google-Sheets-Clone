/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

//Landing Page
import axios from "axios";
import { useState, useEffect } from "react";
import { env } from "process";

const url = process.env.NEXT_PUBLIC_HUSKSHEET_URL;

export default function Dashboard({ params }: { params: { client: string } }) {
  const client = params.client;
  const [sheetName, setSheetName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sheets, setSheets] = useState([]);

  const fetchSheets = async () => {
    try {
      const response = await axios.post(
        `${url}/getSheets`,
        {
          publisher: client,
        },
        {
          auth: {
            username: "team19",
            password: "HDqSU5L28!;X$OzA",
          },
        },
      );
      setSheets(response.data.value);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching sheets:", error);
    }
  };

  const fetchSheetByPublisher = async (publisher: string) => {
    try {
      const response = await axios.post(
        `${url}/getSheets`,
        {
          publisher: publisher,
        },
        {
          auth: {
            username: "team19",
            password: "HDqSU5L28!;X$OzA",
          },
        },
      );
      setSheets(response.data.value);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching sheets:", error);
    }
  }

  useEffect(() => {
    void fetchSheets();
  }, []);

  const createSheet = async (client: string, sheetName: string) => {
    try {
      const response = await axios.post(
        `${url}/createSheet`,
        {
          publisher: client,
          sheet: sheetName,
        },
        {
          auth: {
            username: "team19",
            password: "HDqSU5L28!;X$OzA",
          },
        },
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error creating sheet:", error);
    }
  };

  const deleteSheet = async (client: string, sheetName: string) => {
    try {
      const response = await axios.post(
        `${url}/deleteSheet`,
        {
          publisher: client,
          sheet: sheetName,
        },
        {
          auth: {
            username: "team19",
            password: "HDqSU5L28!;X$OzA",
          },
        },
      );
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

  const handleFetchByPublisher = async () => {
    const publisher = prompt("Enter publisher name:");
    if (publisher) {
      await fetchSheetByPublisher(publisher);
    }
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
      <div className="mx-auto my-16 flex max-w-sm flex-col gap-8 rounded-lg bg-white bg-opacity-80 p-4">
        <div className="text-center">
          <h1 className="text-2xl">{client}&apos;s Spreadsheets</h1>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCreateNewSheet}
            className="rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Create New Sheet
          </button>
          <button
            onClick={handleFetchByPublisher}
            className="rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
          >
            Fetch Sheets by Publisher
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sheets.map(({ publisher, sheet }) => (
            <div
              key={`${publisher}-${sheet}`}
              className="relative flex flex-col items-center justify-center rounded border border-black bg-white bg-opacity-90 p-2"
            >
              <a
                href={`/sheet/${publisher}/${sheet}`}
                className="flex-grow text-center"
              >
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
