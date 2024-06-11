import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { POST } from './route'; // Update the path to your handler file

// Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('POST /api/v1/register', () => {
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
        expect(json).toEqual({ message: 'Missing required fields' });
    });

    it('should create a new user and return 201', async () => {
        const mockUser = { id: "1", username: 'testuser', password: 'testpassword' };
        (prisma.user.create as jest.MockedFunction<typeof prisma.user.create>).mockResolvedValue(mockUser);

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ username: 'testuser', password: 'testpassword' }),
        });

        const res = await POST(req);

        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                username: 'testuser',
                password: 'testpassword',
            },
        });
        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json).toEqual(mockUser);
    });

    it('should return 500 if there is an internal server error', async () => {
        (prisma.user.create as jest.MockedFunction<typeof prisma.user.create>).mockRejectedValue(new Error('Internal server error'));

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ username: 'testuser', password: 'testpassword' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual({ message: 'Internal server error' });
    });
});
