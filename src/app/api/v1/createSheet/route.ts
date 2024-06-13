// Author: Alan Zhang

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

// Create a new sheet given publisher and sheet name
export async function POST(req: NextRequest) {
    try {
        const { publisher, sheet } = await req.json();
        const payload = "";

        if (!publisher || !sheet) {
            return NextResponse.json({success: false, message: 'Missing required fields', value: [], time: currentTime }, { status: 400 });
        }

        const foundPublisher = await prisma.publisher.findFirst({
            where: {
                name: publisher
            }
        });

        if (!foundPublisher) {
            return NextResponse.json({success: false, message: 'Publisher not found', value: [], time: currentTime}, { status: 404 });
        }

        await prisma.sheet.create({
            data: {
                publisherId: foundPublisher.id,
                sheet: sheet,
                payload,
            },
        });

        return NextResponse.json({success: true, message: null, value: [], time: currentTime}, { status: 201 });
    } catch (error) {
        return NextResponse.json({success: false, message: 'Internal server error', value: [], time: currentTime }, { status: 500 });
    }
}
