import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { POST } from './route';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        publisher: {
            findFirst: jest.fn(),
        },
        sheet: {
            findFirst: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('POST /api/v1/deleteSheet', () => {
    let prisma: PrismaClient;
    let req: NextRequest;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const res = await POST(req);

        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: 'Missing required fields',
            value: [],
        });
    });

    it('should return 404 if publisher is not found', async () => {
        (prisma.publisher.findFirst as jest.MockedFunction<typeof prisma.publisher.findFirst>).mockResolvedValue(null);

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'testPublisher', name: 'testSheet' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(404);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: 'Publisher not found',
            value: [],
        });
    });

    it('should return 404 if sheet is not found', async () => {
        (prisma.publisher.findFirst as jest.MockedFunction<typeof prisma.publisher.findFirst>).mockResolvedValue({ id: 'testPublisherId', name: 'testPublisher'});

        (prisma.sheet.findFirst as jest.MockedFunction<typeof prisma.sheet.findFirst>).mockResolvedValue(null);

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'testPublisher', name: 'testSheet' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(404);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: 'Sheet not found',
            value: [],
        });
    });

    it('should delete the sheet and return 200 on success', async () => {
        (prisma.publisher.findFirst as jest.MockedFunction<typeof prisma.publisher.findFirst>).mockResolvedValue({ id: 'testPublisherId', name: 'testPublisher' });

        (prisma.sheet.findFirst as jest.MockedFunction<typeof prisma.sheet.findFirst>).mockResolvedValue({
            id: 'testSheetId',
            publisherId: 'testPublisherId',
            name: 'testSheet',
            payload: '',
        });
        (prisma.sheet.delete as jest.MockedFunction<typeof prisma.sheet.delete>).mockResolvedValue({
            id: 'testSheetId',
            publisherId: 'testPublisherId',
            name: 'testSheet',
            payload: '',
        });

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'testPublisher', name: 'testSheet' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual({
            success: true,
            message: 'Sheet deleted successfully',
            value: [],
        });
    });

    it('should return 500 if there is an internal server error', async () => {
        (prisma.publisher.findFirst as jest.MockedFunction<typeof prisma.publisher.findFirst>).mockRejectedValue(new Error('Internal server error'));

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'ValidPublisher', name: 'SheetToDelete' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: 'Internal server error',
            value: [],
        });
    });
});
