import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new sheet given publisher and sheet name
export async function POST(req: NextRequest) {
    try {
        const { publisher, name } = await req.json();
        const payload = "";

        if (!publisher || !name) {
            return NextResponse.json({success: false, message: 'Missing required fields', value: [] }, { status: 400 });
        }

        const foundPublisher = await prisma.publisher.findFirst({
            where: {
                name: publisher
            }
        });

        if (!foundPublisher) {
            return NextResponse.json({success: false, message: 'Publisher not found', value: []}, { status: 404 });
        }

        await prisma.sheet.create({
            data: {
                publisherId: foundPublisher.id,
                name,
                payload,
            },
        });

        return NextResponse.json({success: true, message: null, value: []}, { status: 201 });
    } catch (error) {
        return NextResponse.json({success: false, message: 'Internal server error', value: [] }, { status: 500 });
    }
}
