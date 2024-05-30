import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const subscriptionRouter = createTRPCRouter({
  getUpdatesForSubscription: publicProcedure
    .input(z.object({ publisher: z.string(), sheet: z.string(), id: z.string() }))
    .query(async ({ input }) => {
      const publisher = await prisma.publisher.findUnique({ where: { name: input.publisher } });
      if (!publisher) throw new Error('Publisher not found');

      const sheet = await prisma.sheet.findUnique({ where: { publisherId_name: { publisherId: publisher.id, name: input.sheet } } });
      if (!sheet) throw new Error('Sheet not found');

      const updates = await prisma.subscriptionUpdate.findMany({
        where: { sheetId: sheet.id, id: { gt: parseInt(input.id, 10) } },
        orderBy: { id: 'asc' },
      });

      const payload = updates.map(u => u.payload).join(', ');
      const lastId = updates.length > 0 ? updates[updates.length - 1].id : parseInt(input.id, 10);

      return { success: true, message: 'Subscription updates retrieved', value: [{ payload, id: lastId.toString() }] };
    }),
  updateSubscription: publicProcedure
    .input(z.object({ publisher: z.string(), sheet: z.string(), payload: z.string() }))
    .mutation(async ({ input }) => {
      const publisher = await prisma.publisher.findUnique({ where: { name: input.publisher } });
      if (!publisher) throw new Error('Publisher not found');

      const sheet = await prisma.sheet.findUnique({ where: { publisherId_name: { publisherId: publisher.id, name: input.sheet } } });
      if (!sheet) throw new Error('Sheet not found');

      await prisma.subscriptionUpdate.create({
        data: { sheetId: sheet.id, payload: input.payload },
      });

      return { success: true, message: 'Subscription update created', value: [] };
    }),
});
