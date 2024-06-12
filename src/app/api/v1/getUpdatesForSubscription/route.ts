import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get updates for a given publisher, sheet, and id
export async function POST(req: NextRequest) {
    try {
        const { publisher, sheet, id } = await req.json() as { publisher: string, sheet: string, id: number };

        if (publisher === undefined || sheet === undefined || id === undefined) {
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


        const updates = await prisma.publishedUpdate.findMany({
            where: {
                sheetId: foundSheet.id,
                id: {
                    gt: String(id)
                }
            },
            orderBy: {
                id: 'asc'
            }
        });

        const payload = updates.map(update => update.payload);
        const lastId = updates.length > 0 ? updates[updates.length - 1]?.id : id;

        const response = {
            payload,
            id: lastId
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching updates:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
