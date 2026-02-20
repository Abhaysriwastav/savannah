import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-savannah-123';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        const admin = await prisma.adminUser.findUnique({
            where: { username },
        });

        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Re-enable httpOnly now that prefetching and domain issues are resolved
        const cookieStore = await cookies();
        cookieStore.set('admin_session', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json(
            { success: true },
            {
                status: 200,
                headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
