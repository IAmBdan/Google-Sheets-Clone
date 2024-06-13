import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

// Get all sheets for a given publisher
export async function POST(req: NextRequest) {
    console.log("getSheets");

    try {
        const { publisher } = await req.json();

        if (!publisher) {
            return NextResponse.json({ success: false, message: 'Missing required fields', value: [], time: currentTime}, { status: 400 });
        }

        const foundPublisher = await prisma.publisher.findFirst({
            where: {
                name: publisher
            }
        });

        if (!foundPublisher) {
            return NextResponse.json({ success: false, message: 'Publisher not found', value: [], time: currentTime }, { status: 404 });
        }

        const sheets = await prisma.sheet.findMany({
            where: {
                publisherId: foundPublisher.id
            }
        });

        const response = sheets.map(({ sheet, id, payload }) => ({
            publisher: foundPublisher.name,
            sheet,
            id,
            payload
        }));

        const result = {
            success: true,
            message: "Sheets retrieved",
            value: response,
            time: currentTime
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal server error', value: [], time: currentTime }, { status: 500 });
    }
}
