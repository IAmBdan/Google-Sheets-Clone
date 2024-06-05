import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Buffer } from 'buffer';

const prisma = new PrismaClient();

// Helper function to parse basic auth
function parseBasicAuth(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
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
            return NextResponse.json({ message: 'Missing or invalid Authorization header' }, { status: 401 });
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
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Create a new publisher with the username as the name
        const newPublisher = await prisma.publisher.create({
            data: {
                name: user.username,
            }
        });

        return NextResponse.json({ message: 'Publisher created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating publisher:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
