"use client"

import { useEffect, useState } from "react";
import { api } from "~/trpc/server";
import SheetInfo from "./sheet-info";

export default function Dashboard() {
    const [userName, setUserName] = useState<string>("user");
    const [sheets, setSheets] = useState<any[]>([]);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Welcome, {userName}!</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <SheetInfo
                    title={"test"}
                    description={"test"}
                />
            </div>
        </div>
    );
}
