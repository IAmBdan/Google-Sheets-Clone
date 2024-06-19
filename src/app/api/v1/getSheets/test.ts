// Author: Alan Zhang

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { POST } from "./route";

// Mock Prisma Client
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    publisher: {
      findFirst: jest.fn(),
    },
    sheet: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("POST /api/v1/getSheets", () => {
  let prisma: PrismaClient;
  let req: NextRequest;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  it("should return 200 if required fields are missing", async () => {
    req = new NextRequest("https://localhost", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      message: "Missing required fields",
      value: [],
      time: expect.any(Number),
    });
  });

  it("should return 200 if publisher is not found", async () => {
    (
      prisma.publisher.findFirst as jest.MockedFunction<
        typeof prisma.publisher.findFirst
      >
    ).mockResolvedValue(null);

    req = new NextRequest("https://localhost", {
      method: "POST",
      body: JSON.stringify({ publisher: "testPublisher" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      message: "Publisher not found",
      value: [],
      time: expect.any(Number),
    });
  });

  it("should return a list of sheets for the given publisher", async () => {
    const mockPublisher = { id: "1", name: "testPublisher" };
    const mockSheets = [
      { id: "1", publisherId: "1", sheet: "Sheet1", payload: "" },
      { id: "2", publisherId: "1", sheet: "Sheet2", payload: "" },
    ];

    (
      prisma.publisher.findFirst as jest.MockedFunction<
        typeof prisma.publisher.findFirst
      >
    ).mockResolvedValue(mockPublisher);
    (
      prisma.sheet.findMany as jest.MockedFunction<typeof prisma.sheet.findMany>
    ).mockResolvedValue(mockSheets);

    req = new NextRequest("https://localhost", {
      method: "POST",
      body: JSON.stringify({ publisher: "testPublisher" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      success: true,
      message: "Sheets retrieved",
      value: [
        { id: "1", payload: "", publisher: "testPublisher", sheet: "Sheet1" },
        { id: "2", payload: "", publisher: "testPublisher", sheet: "Sheet2" },
      ],
      time: expect.any(Number),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (
      prisma.publisher.findFirst as jest.MockedFunction<
        typeof prisma.publisher.findFirst
      >
    ).mockRejectedValue(new Error("Internal server error"));

    req = new NextRequest("https://localhost", {
      method: "POST",
      body: JSON.stringify({ publisher: "testPublisher" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      message: "Internal server error",
      value: [],
      time: expect.any(Number),
    });
  });
});
