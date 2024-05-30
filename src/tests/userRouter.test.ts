import { PrismaClient } from '@prisma/client';
import { api } from '../trpc/server';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock Prisma client
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockDeep<PrismaClient>())
}));

const prisma = new PrismaClient() as unknown as DeepMockProxy<PrismaClient>;

describe('userRouter', () => {
    beforeEach(() => {
        mockReset(prisma);
    });

    it('should return all users', async () => {
        // Assemble
        prisma.user.findMany.mockResolvedValue([
            { id: 1, email: "test1", name: 'test1' },
            { id: 2, email: "test2", name: 'test2' },
        ]);

        // Act
        const users = await api.user.getAll();

        // Assess
        expect(users).toEqual({
            success: true,
            message: 'Users',
            value: [{ user: '1' }, { user: '2' }],
        });
    });
});
