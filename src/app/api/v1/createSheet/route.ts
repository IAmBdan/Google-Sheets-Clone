import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new sheet given publisher and sheet name
export async function POST(req: NextRequest) {
    try {
        const { publisher, name } = await req.json();
        const payload = "";

        if (!publisher || !name) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const foundPublisher = await prisma.publisher.findFirst({
            where: {
                name: publisher
            }
        });

        if (!foundPublisher) {
            return NextResponse.json({ message: 'Publisher not found' }, { status: 404 });
        }

        const newSheet = await prisma.sheet.create({
            data: {
                publisherId: foundPublisher.id,
                name,
                payload,
            },
        });

        return NextResponse.json(newSheet, { status: 201 });
    } catch (error) {
        console.error('Error creating sheet:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
