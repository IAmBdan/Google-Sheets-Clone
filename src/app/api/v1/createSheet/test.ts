/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { POST } from "./route";

// Mock Prisma Client
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    publisher: {
      findFirst: jest.fn(),
    },
    sheet: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("POST /api/v1/createSheet", () => {
  let prisma: PrismaClient;
  let req: NextRequest;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      message: "Missing required fields",
      value: [],
      time: expect.any(Number),
    });
  });

  it("should return 404 if publisher is not found", async () => {
    (
      prisma.publisher.findFirst as jest.MockedFunction<
        typeof prisma.publisher.findFirst
      >
    ).mockResolvedValue(null);

    req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ publisher: "testPublisher", sheet: "testSheet" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      message: "Publisher not found",
      value: [],
      time: expect.any(Number),
    });
  });

  it("should create a new sheet and return 201", async () => {
    (
      prisma.publisher.findFirst as jest.MockedFunction<
        typeof prisma.publisher.findFirst
      >
    ).mockResolvedValue({ id: "testPublisherId", name: "testPublisher" });
    (
      prisma.sheet.create as jest.MockedFunction<typeof prisma.sheet.create>
    ).mockResolvedValue({
      id: "testSheetId",
      publisherId: "testPublisherId",
      sheet: "testSheet",
      payload: "",
    });

    req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ publisher: "testPublisher", sheet: "testSheet" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toEqual({
      message: null,
      success: true,
      value: [],
      time: expect.any(Number),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (
      prisma.publisher.findFirst as jest.MockedFunction<
        typeof prisma.publisher.findFirst
      >
    ).mockRejectedValue(new Error("Internal server error"));

    req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ publisher: "testPublisher", sheet: "testSheet" }),
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
