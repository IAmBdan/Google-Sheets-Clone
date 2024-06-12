import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

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
            time: currentTime
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'server error', value: [], time: currentTime, }, { status: 500 });
    }
}
