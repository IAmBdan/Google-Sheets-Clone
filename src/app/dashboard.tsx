"use client"

import { api } from "~/trpc/server";
import SheetInfo from "./sheet-info";

// Giastina
export default function Dashboard() {
    // const sheets = api.sheet.getAll();
    // console.log(sheets);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Welcome, user!</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">\
                <SheetInfo
                    title={"test"}
                    publisher={"test"}
                />
            </div>
        </div>
    );
}
