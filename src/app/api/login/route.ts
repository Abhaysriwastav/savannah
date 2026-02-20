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

        // Create the cookie strings manually for absolute control
        const sessionCookie = `savannah_admin_session=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24}; Path=/`;
        const debugCookie = `savannah_debug_flag=exists; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24}; Path=/`;

        // Set response with explicit headers
        const response = NextResponse.json(
            { success: true },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                }
            }
        );

        response.headers.append('Set-Cookie', sessionCookie);
        response.headers.append('Set-Cookie', debugCookie);

        console.log('API Login: Set-Cookie headers appended manually');

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
