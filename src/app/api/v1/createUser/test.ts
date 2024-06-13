<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Chris
import { NextRequest } from 'next/server';
=======
import { NextRequest, NextResponse } from 'next/server';
>>>>>>> eec46011e15ec35b8cd5862aff71714472524ef7
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

    it('should create a new user and return 201', async () => {
        const mockUser = { id: '1', username: 'testuser', password: 'password' };
        (prisma.user.create as jest.MockedFunction<typeof prisma.user.create>).mockResolvedValue(mockUser);
        (prisma.publisher.create as jest.MockedFunction<typeof prisma.publisher.create>).mockResolvedValue({ id: '1', name: 'testuser' });

        req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ username: 'testuser', password: 'password' }),
        });

        const res = await POST(req);

        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json).toEqual({
            success: true,
            message: null,
            value: mockUser,
            time: expect.any(Number),
        });
    });
});
