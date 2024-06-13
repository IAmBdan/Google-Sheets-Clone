// Author: Alan Zhang

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

// Update the published sheet with the given payload
export async function POST(req: NextRequest) {
    try {
        const { publisher, sheet, payload } = await req.json();

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

        await prisma.sheet.update({
            where: {
                id: foundSheet.id
            },
            data: {
                payload
            }
        });

        return NextResponse.json({ success: true, message: 'Sheet updated successfully', value: [], time: currentTime }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error', value: [], time: currentTime }, { status: 500 });
    }
}
