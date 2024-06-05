//Alan Zhang

import type { NextRequest } from "next/server"
import { NextApiRequest, NextApiResponse } from "next";

//getUpdatesForSubscription is a POST request
export async function POST (req: NextApiRequest, res: NextApiResponse) {
    return new Response("getUpdatesForSubscription working");
}