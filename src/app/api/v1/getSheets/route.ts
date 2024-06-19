// Author: Alan Zhang

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

// Get all sheets for a given publisher
export async function POST(req: NextRequest) {
    try {
        const { publisher } = await req.json();

        if (!publisher) {
            console.log("Missing required fields");
            return NextResponse.json({ success: false, message: 'Missing required fields', value: [], time: currentTime}, { status: 200 });
        }

        const foundPublisher = await prisma.publisher.findFirst({
            where: {
                name: publisher
            }
        });

        if (!foundPublisher) {
            console.log("Publisher not found");
            return NextResponse.json({ success: false, message: 'Publisher not found', value: [], time: currentTime }, { status: 200 });
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
