// Chris
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

// Update the subscription with the given payload
export async function POST(req: NextRequest) {
    try {
        const { publisher, sheet, payload } = await req.json() as { publisher: string, sheet: string, payload: string };

        if (!publisher || !sheet || !payload) {
            return NextResponse.json({ success: false, message: 'Missing required fields', value: [], time: currentTime }, { status: 400 });
        }

        const foundPublisher = await prisma.publisher.findFirst({
            where: {
                name: publisher
            }
        });

        if (!foundPublisher) {
            return NextResponse.json({ success: false, message: 'Publisher not found', value: [], time: currentTime }, { status: 404 });
        }

        const foundSheet = await prisma.sheet.findFirst({
            where: {
                publisherId: foundPublisher.id,
                sheet: sheet
            }
        });

        if (!foundSheet) {
            return NextResponse.json({ success: false, message: 'Sheet not found', value: [], time: currentTime }, { status: 404 });
        }

        const updatedSubscription = await prisma.publishedUpdate.create({
            data: {
                sheetId: foundSheet.id,
                payload
            }
        });

        return NextResponse.json({ success: true, message: 'Subscription update recorded successfully', value: [], time: currentTime }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error', value: [], time: currentTime }, { status: 500 });
    }
}
