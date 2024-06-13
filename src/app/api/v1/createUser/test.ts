// Chris
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

describe('POST /api/v1/createUser', () => {
    let prisma: PrismaClient;

    beforeEach(() => {
        prisma = new PrismaClient();
        jest.clearAllMocks();
    });

    it('should create a new user and return 201', async () => {
        const mockUser = { id: "1", username: 'testuser', password: 'testpassword' };
        (prisma.user.create as jest.MockedFunction<typeof prisma.user.create>).mockResolvedValue(mockUser);
    
        const req = new NextRequest('http://localhost', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ username: 'testuser', password: 'testpassword' }),
        });
    
        const res = await POST(req);
    
        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json).toEqual({
            success: true,
            message: null,
            value: mockUser,
            time: expect.any(Number), // to verify the time property exists and is a number
        });
    });
    
});
