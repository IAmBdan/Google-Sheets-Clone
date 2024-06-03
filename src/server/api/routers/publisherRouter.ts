import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Publisher = {
  name: string;
}

export const publisherRouter = createTRPCRouter({
  // Register a publisher
  register: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      try {
        console.log(input.name);
        // console.log(input);
        // await prisma.publisher.create({ data: { name: input.name } });
        return { success: true };
      } catch (error) {
        console.log(error);
      }
    }),

  // Get publishers
  getPublishers: publicProcedure.query(async () => {
    const publishers = await prisma.publisher.findMany();
    const result = publishers.map(p => ({
      publisher: p.name,
      sheet: null,
      id: null,
      payload: null
    }));
    return {
      success: true,
      message: null,
      value: result,
      time: Date.now()
    };
  }),

  // test
  postMessage: publicProcedure
  .input(
    z.object({
      name: z.string(),
      message: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      console.log(ctx, input);
    } catch (error) {
      console.log(error);
    }
  }),
});