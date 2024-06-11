import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new sheet given publisher and sheet name
export async function POST(req: NextRequest) {
    const { username, password } = await req.json();
    const user = await prisma.user.create({
        data: {
            username,
            password
        }
    });
    return NextResponse.json(user, { status: 201 });
}