import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    const { body } = req;
    return new Response("working");
}