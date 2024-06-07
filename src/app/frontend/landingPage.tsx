import axios from "axios";
import { useState, useEffect } from "react";

export default function LandingPage() {
    const [client, setClient] = useState("");
    const [sheetName, setSheetName] = useState("");
    const [sheets, setSheets] = useState([]);

    useEffect(() => {
        const fetchSheets = async () => {
            try {
              const response = await axios.post('/api/v1/getSheets', {publisher: client}); // Adjust to your actual endpoint
              setSheets(response.data);
              console.log(response.data);
            } catch (error) {
              console.error('Error fetching sheets:', error);
            }
        };

        void fetchSheets();
    }, []);

    const createSheet = async () => {
        try {
            const response = await axios.post('/api/v1/createSheet', { publisher: client, sheet: sheetName }); // Adjust the payload as needed
            setSheets([...sheets, response.data]);
            console.log(response.data);
        } catch (error) {
            console.error('Error creating sheet:', error);
        }
    };

    const deleteSheet = async (id: number) => {
        try {
            await axios.post('/api/v1/deleteSheet', { publisher: client, sheet: sheetName}); // Adjust to your actual endpoint
            setSheets(sheets.filter(sheet => sheet.id !== id));
            console.log(`Sheet with id ${id} deleted`);
        } catch (error) {
            console.error('Error deleting sheet:', error);
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
                    className="w-full p-2 border rounded-md"
                />
                <button 
                    onClick={createSheet}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                    Create New Sheet
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sheets.map((sheet) => (
                    <div key={sheet.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-bold mb-2">{sheet.name}</h2>
                        <button 
                            onClick={() => deleteSheet(sheet.id)}
                            className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}