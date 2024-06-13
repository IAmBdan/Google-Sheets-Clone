// @author Chris
import { NextRequest } from 'next/server';
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
            update: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('POST /api/v1/updateSheet', () => {
    let prisma: PrismaClient;
    let req: NextRequest;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'testPublisher', sheet: 'testSheet' }), // payload is missing
        });

        const res = await POST(req);

        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: 'Missing required fields',
            value: [],
            time: expect.any(Number),
        });
    });

    it('should return 404 if publisher is not found', async () => {
        (prisma.publisher.findFirst as jest.MockedFunction<typeof prisma.publisher.findFirst>).mockResolvedValue(null);

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'testPublisher', sheet: 'testSheet', payload: 'newPayload' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(404);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: 'Publisher not found',
            value: [],
            time: expect.any(Number),
        });
    });

    it('should return 404 if sheet is not found', async () => {
        const mockPublisher = { id: '1', name: 'testPublisher' };
        (prisma.publisher.findFirst as jest.MockedFunction<typeof prisma.publisher.findFirst>).mockResolvedValue(mockPublisher);
        (prisma.sheet.findFirst as jest.MockedFunction<typeof prisma.sheet.findFirst>).mockResolvedValue(null);

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'testPublisher', sheet: 'testSheet', payload: 'newPayload' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(404);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: 'Sheet not found',
            value: [],
            time: expect.any(Number),
        });
    });

    it('should return 200 and update the sheet if successful', async () => {
        const mockPublisher = { id: '1', name: 'testPublisher' };
        const mockSheet = { id: '1', publisherId: '1', sheet: 'testSheet', payload: 'oldPayload' };

        (prisma.publisher.findFirst as jest.MockedFunction<typeof prisma.publisher.findFirst>).mockResolvedValue(mockPublisher);
        (prisma.sheet.findFirst as jest.MockedFunction<typeof prisma.sheet.findFirst>).mockResolvedValue(mockSheet);
        (prisma.sheet.update as jest.MockedFunction<typeof prisma.sheet.update>).mockResolvedValue({
            ...mockSheet,
            payload: 'newPayload'
        });

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'testPublisher', sheet: 'testSheet', payload: 'newPayload' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual({
            success: true,
            message: 'Sheet updated successfully',
            value: [],
            time: expect.any(Number),
        });
    });

    it('should return 500 if there is an internal server error', async () => {
        (prisma.publisher.findFirst as jest.MockedFunction<typeof prisma.publisher.findFirst>).mockRejectedValue(new Error('Internal server error'));

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'testPublisher', sheet: 'testSheet', payload: 'newPayload' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: 'Internal server error',
            value: [],
            time: expect.any(Number),
        });
    });
});
