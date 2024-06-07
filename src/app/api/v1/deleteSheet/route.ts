import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Delete a sheet given publisher and sheet name
export async function POST(req: NextRequest) {
    try {
        const { publisher, name } = await req.json();

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

        const sheet = await prisma.sheet.findFirst({
            where: {
                publisherId: foundPublisher.id,
                name: name
            }
        });

        if (!sheet) {
            return NextResponse.json({ message: 'Sheet not found' }, { status: 404 });
        }

        await prisma.sheet.delete({
            where: {
                id: sheet.id
            }
        });

        return NextResponse.json({ message: 'Sheet deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting sheet:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
