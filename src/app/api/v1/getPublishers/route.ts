<<<<<<< HEAD
// Chris
import { NextResponse } from 'next/server';
=======
// @author Chris
import { NextRequest, NextResponse } from 'next/server';
>>>>>>> eec46011e15ec35b8cd5862aff71714472524ef7
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

// Get all registered publishers
export async function GET() {
    try {
        const publishers = await prisma.publisher.findMany();

        const response = publishers.map((publisher: {id: string, name: string}) => ({
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
