import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to parse basic auth
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

export async function GET(req: NextRequest) {
    try {
        const credentials = parseBasicAuth(req);
        if (!credentials) {
            return NextResponse.json({ message: 'Authorization header is missing or invalid' }, { status: 401 });
        }

        const { username, password } = credentials;

        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Compare passwords
        if (user.password !== password) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        return NextResponse.json({ message: 'User authenticated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}