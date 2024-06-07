import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update the published sheet with the given payload
export async function POST(req: NextRequest) {
    try {
        const { publisher, sheet, payload } = await req.json();

        if (!publisher || !sheet || !payload) {
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

        const foundSheet = await prisma.sheet.findFirst({
            where: {
                publisherId: foundPublisher.id,
                name: sheet
            }
        });

        if (!foundSheet) {
            return NextResponse.json({ message: 'Sheet not found' }, { status: 404 });
        }

        const updatedSheet = await prisma.sheet.update({
            where: {
                id: foundSheet.id
            },
            data: {
                payload
            }
        });

        return NextResponse.json({ message: 'Sheet updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating sheet:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
