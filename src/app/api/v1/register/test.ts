import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Buffer } from 'buffer';
import { GET } from './route';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            findFirst: jest.fn(),
        },
        publisher: {
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('GET /api/v1/register', () => {
    let prisma: PrismaClient;
    let req: NextRequest;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    it('should return 401 if missing or invalid authorization header', async () => {
        req = new NextRequest('http://localhost', { method: 'GET' });

        const res = await GET(req);

        expect(res.status).toBe(401);
        const json = await res.json();
        expect(json).toEqual({ message: 'Missing or invalid Authorization header' });
    });

    it('should return 401 if invalid credentials', async () => {
        (prisma.user.findFirst as jest.MockedFunction<typeof prisma.user.findFirst>).mockResolvedValue(null);

        const credentials = Buffer.from('invalidUser:invalidPassword').toString('base64');
        req = new NextRequest('http://localhost', {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Basic ${credentials}`
            }),
        });

        const res = await GET(req);

        expect(res.status).toBe(401);
        const json = await res.json();
        expect(json).toEqual({ message: 'Invalid credentials' });
    });

    it('should create a new publisher and return 201', async () => {
        (prisma.user.findFirst as jest.MockedFunction<typeof prisma.user.findFirst>).mockResolvedValue({id: '1', username: 'validUser', password: 'validPassword' });
        (prisma.publisher.create as jest.MockedFunction<typeof prisma.publisher.create>).mockResolvedValue({ id: '1', name: 'validUser' });

        const credentials = Buffer.from('validUser:validPassword').toString('base64');
        req = new NextRequest('http://localhost', {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Basic ${credentials}`
            }),
        });

        const res = await GET(req);

        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json).toEqual({ message: 'Publisher created successfully' });
    });

    it('should return 500 if there is an internal server error', async () => {
        (prisma.user.findFirst as jest.MockedFunction<typeof prisma.user.findFirst>).mockRejectedValue(new Error('Internal server error'));

        const credentials = Buffer.from('validUser:validPassword').toString('base64');
        req = new NextRequest('http://localhost', {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Basic ${credentials}`
            }),
        });

        const res = await GET(req);

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual({ message: 'Internal server error' });
    });
});
