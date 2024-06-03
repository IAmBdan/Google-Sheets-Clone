import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        const user = await prisma.user.findMany();  
        const result = user.map(u => ({ user: u.id }));
        return { success: true, message: 'Users', value: result };
    }),
})