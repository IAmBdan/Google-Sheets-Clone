// Author: Alan Zhang

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentTime = Date.now();

// Delete a sheet given publisher and sheet name
export async function POST(req: NextRequest) {
    try {
        const { publisher, sheet } = await req.json();

        if (!publisher || !sheet) {
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
            return NextResponse.json({ success: false, message: `Sheet does not exist: ${sheet}`, value: [], time: currentTime }, { status: 200 });
        }

        await prisma.publishedUpdate.deleteMany({
            where: {
                sheetId: foundSheet.id
            }
        })

        await prisma.sheet.delete({
            where: {
                id: foundSheet.id
            }
        });

        return NextResponse.json({ success: true, message: 'Sheet deleted successfully', value: [], time: currentTime }, { status: 200 });
    } catch (error) {
        console.error(console.error('Error deleting sheet:', error));
        return NextResponse.json({ success: false, message: 'Internal server error', value: [], time: currentTime }, { status: 500 });
    }
}
