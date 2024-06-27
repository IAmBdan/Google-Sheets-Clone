
import { type NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Buffer } from 'buffer';

const prisma = new PrismaClient();
const currentTime = Date.now();

function parseBasicAuth(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Basic ')) {
        return null;
    }

    const base64Credentials = authHeader.split(' ')[1];
    if (!base64Credentials) {
        return null;
    }

    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    return { username, password };
}

// Register a new publisher with the client name given
export async function GET(req: NextRequest) {
    try {
        const credentials = parseBasicAuth(req);

        if (!credentials) {
            return NextResponse.json({ success: false, message: 'Missing or invalid Authorization header', value: [], time: currentTime }, { status: 401 });
        }

        const { username, password } = credentials;

        // Validate user credentials
        const user = await prisma.user.findFirst({
            where: {
                username,
                password
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials', value: [], time: currentTime }, { status: 401 });
        }

        // Check if the publisher already exists
        const existingPublisher = await prisma.publisher.findFirst({
            where: {
                name: username
            }
        });

        // If there is already a publisher named that, no problem man
        if (existingPublisher) {
            return NextResponse.json({ success: true, message: null, value: [], time: currentTime }, { status: 200 });
        } else {
            // otherwise, create the publisher using the given name
            await prisma.publisher.create({
                data: {
                    name: username
                }
            })
        }

        return NextResponse.json({ success: true, message: 'Publisher created successfully', value: [], time: currentTime }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error', value: [], time: currentTime }, { status: 500 });
    }
}
