/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

// Get updates for a given publisher, sheet, and id
export async function POST(req: NextRequest) {
    try {
        const { publisher, sheet, id } = await req.json();

        if (!publisher || !sheet || !id) {
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

        const updates = await prisma.publishedUpdate.findMany({
            where: {
                sheetId: foundSheet.id,
                id: {
                    gt: id
                }
            },
            orderBy: {
                id: 'asc'
            }
        });

        const payload = updates.map(update => update.payload);
        const lastId = updates.length > 0 ? updates[updates.length - 1]?.id : id;

        const response = {
            publisher,
            sheet,
            payload,
            id: lastId
        };

        const result = {
            success: true,
            message: null,
            value: response,
            time: currentTime
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal server error', value: [], time: currentTime }, { status: 500 });
    }
}
