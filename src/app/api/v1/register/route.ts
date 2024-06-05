//Alan Zhang

import type { NextRequest } from "next/server"
import { NextApiRequest, NextApiResponse } from "next";

//register is a GET request
export async function GET (req: NextApiRequest, res: NextApiResponse) {
    return new Response("register working");
}