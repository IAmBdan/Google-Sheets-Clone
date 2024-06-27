
import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const currentTime = Date.now();

// Helper function to parse basic auth
function parseBasicAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return null;
  }

  const base64Credentials = authHeader.split(" ")[1];
  if (!base64Credentials) {
    return null;
  }

  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii",
  );
  const [username, password] = credentials.split(":");
  return { username, password };
}

export async function GET(req: NextRequest) {
  try {
    const credentials = parseBasicAuth(req);
    if (!credentials) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header is missing or invalid",
          value: [],
          time: currentTime,
        },
        { status: 401 },
      );
    }

    const { username, password } = credentials;

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found", value: [], time: currentTime },
        { status: 404 },
      );
    }

    // Compare passwords
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid password", value: [], time: currentTime },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: true, message: "User authenticated successfully", value: [], time: currentTime },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "", error: "An error occurred", value: [], time: currentTime },
      { status: 500 },
    );
  }
}
