import type { NextRequest } from "next/server"
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextRequest) {
    const { body } = req;
    return new Response("example working");
}

export async function GET (req: NextApiRequest, res: NextApiResponse) {
    return new Response("woring");
}