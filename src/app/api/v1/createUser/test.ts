

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { POST } from './route';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            create: jest.fn(),
        },
        publisher: {
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('POST /api/v1/createUser', () => {
    let prisma: PrismaClient;
    let req: NextRequest;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    it('should create a new user and return 200', async () => {
        const mockUser = { id: '1', username: 'testuser', password: 'password' };
        (prisma.user.create as jest.MockedFunction<typeof prisma.user.create>).mockResolvedValue(mockUser);
        (prisma.publisher.create as jest.MockedFunction<typeof prisma.publisher.create>).mockResolvedValue({ id: '1', name: 'testuser' });

        req = new NextRequest('https://localhost', {
            method: 'POST',
            body: JSON.stringify({ username: 'testuser', password: 'password' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual({
            success: true,
            message: null,
            value: mockUser,
            time: expect.any(Number),
        });
    });
});
