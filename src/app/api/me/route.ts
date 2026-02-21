import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    try {
        // verifyAuth acts loosely here - we just want the payload of the current user.
        // It returns the payload including 'role' and 'permissions'.
        const userPayload = await verifyAuth();

        return NextResponse.json({
            id: userPayload.id,
            username: userPayload.username,
            role: userPayload.role,
            permissions: userPayload.permissions || []
        });
    } catch (error) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
