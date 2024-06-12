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

        const result = {
            success: true,
            message: null,
            value: response,
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'server error', value: [] }, { status: 500 });
    }
}
