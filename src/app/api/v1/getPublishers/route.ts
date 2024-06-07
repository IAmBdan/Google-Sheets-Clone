import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all registered publishers
export async function GET(req: NextRequest) {
    try {
        const publishers = await prisma.publisher.findMany();

        const response = publishers.map(publisher => ({
            publisher: publisher.name
        }));

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching publishers:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
