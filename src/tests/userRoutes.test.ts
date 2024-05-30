import { api } from "../trpc/server";

describe('userRoutes', () => {
    test('gets all users', async () => {
        const users = await api.user.getAll();
        expect(users).toBeDefined();
    });
});