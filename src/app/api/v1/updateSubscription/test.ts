/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
        },
        publishedUpdate: {
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('POST /api/v1/updateSubscription', () => {
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

    it('should return 200 and record the subscription update if successful', async () => {
        const mockPublisher = { id: '1', name: 'testPublisher' };
        const mockSheet = { id: '1', publisherId: '1', sheet: 'testSheet', payload: 'oldPayload' };
        const mockUpdate = { id: '1', sheetId: '1', payload: 'newPayload', timestamp: new Date() };

        (prisma.publisher.findFirst as jest.MockedFunction<typeof prisma.publisher.findFirst>).mockResolvedValue(mockPublisher);
        (prisma.sheet.findFirst as jest.MockedFunction<typeof prisma.sheet.findFirst>).mockResolvedValue(mockSheet);
        (prisma.publishedUpdate.create as jest.MockedFunction<typeof prisma.publishedUpdate.create>).mockResolvedValue(mockUpdate);

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ publisher: 'testPublisher', sheet: 'testSheet', payload: 'newPayload' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual({
            success: true,
            message: 'Subscription update recorded successfully',
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
