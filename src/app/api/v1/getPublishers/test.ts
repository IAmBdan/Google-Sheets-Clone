import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GET } from "./route";

// Mock Prisma Client
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    publisher: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("GET /api/v1/getPublishers", () => {
  let prisma: PrismaClient;
  let req: NextRequest;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  it("should return a list of publishers", async () => {
    const mockPublishers = [
      { id: "1", name: "Publisher1" },
      { id: "2", name: "Publisher2" },
    ];
    (
      prisma.publisher.findMany as jest.MockedFunction<
        typeof prisma.publisher.findMany
      >
    ).mockResolvedValue(mockPublishers);

    req = new NextRequest("http://localhost", { method: "GET" });

    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      success: true,
      message: null,
      value: [{ publisher: "Publisher1" }, { publisher: "Publisher2" }],
      time: expect.any(Number),
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    (
      prisma.publisher.findMany as jest.MockedFunction<
        typeof prisma.publisher.findMany
      >
    ).mockRejectedValue(new Error("Internal server error"));

    req = new NextRequest("http://localhost", { method: "GET" });

    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({
      success: false,
      message: "server error",
      value: [],
      time: expect.any(Number),
    });
  });
});
