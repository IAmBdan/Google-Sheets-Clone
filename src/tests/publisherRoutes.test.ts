"use client"
import { api } from "../trpc/server";

describe('publisherRoutes', () => {
    test('register publisher', async () => {
        const result = await api.publisher.register({ name: "test" });
        console.log(result)
        expect(result).toBeDefined();
    });
});