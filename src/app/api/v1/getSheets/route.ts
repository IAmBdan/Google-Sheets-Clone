import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all sheets for a given publisher
export async function POST(req: NextRequest) {
    try {
        const { publisher } = await req.json();

        if (!publisher) {
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

        const sheets = await prisma.sheet.findMany({
            where: {
                publisherId: foundPublisher.id
            }
        });

        const response = sheets.map(sheet => ({
            publisher: foundPublisher.name,
            sheet: sheet.name,
            id: sheet.id,
            payload: sheet.payload
        }));

        const result = {
            success: true,
            message: "Sheets retrieved",
            value: response
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error', value: [] }, { status: 500 });
    }
}
