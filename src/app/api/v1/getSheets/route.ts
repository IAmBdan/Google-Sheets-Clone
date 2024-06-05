import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all sheets for a given publisher
export async function POST(req: NextRequest) {
    try {
        const { publisher } = await req.json();

        if (!publisher) {
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

        const sheets = await prisma.sheet.findMany({
            where: {
                publisherId: foundPublisher.id
            }
        });

        const response = sheets.map(sheet => ({
            publisher: foundPublisher.name,
            sheet: sheet.name
        }));

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching sheets:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
