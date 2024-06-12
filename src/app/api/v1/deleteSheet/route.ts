import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Delete a sheet given publisher and sheet name
export async function POST(req: NextRequest) {
    try {
        const { publisher, name } = await req.json();

        if (!publisher || !name) {
            return NextResponse.json({ success: false, message: 'Missing required fields', value: [] }, { status: 400 });
        }

        const foundPublisher = await prisma.publisher.findFirst({
            where: {
                name: publisher
            }
        });

        if (!foundPublisher) {
            return NextResponse.json({ success: false, message: 'Publisher not found', value: [] }, { status: 404 });
        }

        const sheet = await prisma.sheet.findFirst({
            where: {
                publisherId: foundPublisher.id,
                name: name
            }
        });

        if (!sheet) {
            return NextResponse.json({ success: false, message: 'Sheet not found', value: [] }, { status: 404 });
        }

        await prisma.sheet.delete({
            where: {
                id: sheet.id
            }
        });

        return NextResponse.json({ success: true, message: 'Sheet deleted successfully', value: [] }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error', value: [] }, { status: 500 });
    }
}
