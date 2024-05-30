import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const publisherRouter = createTRPCRouter ({
    register: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.publisher.create({ data: { name: input.name } });
      return { success: true, message: 'Publisher registered', value: [] };
    }),
    getPublishers: publicProcedure.query(async () => {
        const publishers = await prisma.publisher.findMany();
        const result = publishers.map(p => ({ publisher: p.name }));
        return { success: true, message: 'Publishers retrieved', value: result };
      }),
})