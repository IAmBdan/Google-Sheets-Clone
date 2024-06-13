import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

// Register a new publisher with the client name given
export async function GET(req: NextRequest) {
    try {
        const {username} = await req.query;

        // Create a new publisher with the username as the name
        const existingPublisher = await prisma.publisher.findFirst({
            where: {
                name: username
            }
        });

        if (existingPublisher) {
            return NextResponse.json({ success: false, message: 'Publisher already exists', value: [], time: currentTime }, { status: 409 });
        }

        await prisma.publisher.create({
            data: {
                name: username
            }
        });

        return NextResponse.json({ success: true, message: 'Publisher created successfully', value: [], time: currentTime }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error', value: [], time: currentTime }, { status: 500 });
    }
}
