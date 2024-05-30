import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sheetRouter = createTRPCRouter({
  createSheet: publicProcedure
    .input(z.object({ publisher: z.string(), sheet: z.string() }))
    .mutation(async ({ input }) => {
      const publisher = await prisma.publisher.findUnique({ where: { id: input.publisher } });
      if (!publisher) throw new Error('Publisher not found');

      await prisma.sheet.create({
        data: { publisherId: publisher.id, name: input.sheet, payload: '' },
      });
      return { success: true, message: 'Sheet created', value: [] };
    }),

  getSheets: publicProcedure
    .input(z.object({ publisher: z.string() }))
    .query(async ({ input }) => {
      const publisher = await prisma.publisher.findUnique({ where: { id: input.publisher } });
      if (!publisher) throw new Error('Publisher not found');

      const sheets = await prisma.sheet.findMany({ where: { publisherId: publisher.id } });
      const result = sheets.map(s => ({ publisher: input.publisher, sheet: s.name }));
      return { success: true, message: 'Sheets retrieved', value: result };
    }),

  deleteSheet: publicProcedure
    .input(z.object({ publisher: z.string(), sheet: z.string() }))
    .mutation(async ({ input }) => {
      const publisher = await prisma.publisher.findUnique({ where: { id: input.publisher } });
      if (!publisher) throw new Error('Publisher not found');

      await prisma.sheet.delete({
        where: { id: publisher.id, publisherId: publisher.id, name: input.sheet },
      });
      return { success: true, message: 'Sheet deleted', value: [] };
    }),
});
