import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Buffer } from 'buffer';
import { GET } from "./route";

// Mock Prisma Client
jest.mock("@prisma/client", () => {
    const mPrismaClient = {
        user: {
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("GET /api/checkUser", () => {
    let prisma: PrismaClient;
    let req: NextRequest;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    it("should return 401 if authorization header is missing", async () => {
        req = new NextRequest("http://localhost", { method: "GET" });

        const res = await GET(req);

        expect(res.status).toBe(401);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: "Authorization header is missing or invalid",
            value: [],
            time: expect.any(Number),
        });
    });

    it("should return 404 if user is not found", async () => {
        (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue(null);

        const credentials = Buffer.from('nonexistentuser:password').toString('base64');
        req = new NextRequest('http://localhost', {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Basic ${credentials}`,
            }),
        });

        const res = await GET(req);

        expect(res.status).toBe(404);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: "User not found",
            value: [],
            time: expect.any(Number),
        });
    });

    it("should return 401 if password is incorrect", async () => {
        (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue({
            id: '1',
            username: 'testuser',
            password: 'correctpassword',
        });

        const credentials = Buffer.from('testuser:wrongpassword').toString('base64');
        req = new NextRequest('http://localhost', {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Basic ${credentials}`,
            }),
        });

        const res = await GET(req);

        expect(res.status).toBe(401);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: "Invalid password",
            value: [],
            time: expect.any(Number),
        });
    });

    it("should return 200 if user is authenticated successfully", async () => {
        (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockResolvedValue({
            id: '1',
            username: 'testuser',
            password: 'correctpassword',
        });

        const credentials = Buffer.from('testuser:correctpassword').toString('base64');
        req = new NextRequest('http://localhost', {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Basic ${credentials}`,
            }),
        });

        const res = await GET(req);

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual({
            success: true,
            message: "User authenticated successfully",
            value: [],
            time: expect.any(Number),
        });
    });

    it("should return 500 if there is an internal server error", async () => {
        // Mock the response for findUnique to throw an error
        (prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>).mockRejectedValue(new Error('Internal server error'));

        const credentials = Buffer.from('testuser:correctpassword').toString('base64');
        req = new NextRequest('http://localhost', {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Basic ${credentials}`,
            }),
        });

        const res = await GET(req);

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: "",
            error: "An error occurred",
            value: [],
            time: expect.any(Number),
        });
    });
});
