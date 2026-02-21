import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    try {
        // Enforce Superadmin-only access
        await verifyAuth();

        const users = await prisma.adminUser.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                permissions: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch Admin users', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await verifyAuth(); // Superadmin-only

        const data = await request.json();
        const { username, password, role, permissions } = data;

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.adminUser.findUnique({
            where: { username }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.adminUser.create({
            data: {
                username,
                passwordHash: hashedPassword,
                role: role || 'editor',
                permissions: Array.isArray(permissions) ? permissions : []
            },
            select: {
                id: true,
                username: true,
                role: true,
                permissions: true,
                createdAt: true,
            }
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to create user', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        await verifyAuth(); // Superadmin-only

        const data = await request.json();
        const { id, username, password, role, permissions } = data;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const updateData: any = {
            username,
            role,
            permissions: Array.isArray(permissions) ? permissions : []
        };

        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.adminUser.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                role: true,
                permissions: true,
                createdAt: true,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to update user', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        await verifyAuth(); // Superadmin-only

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Prevent superadmin from deleting themselves if they are the only superadmin
        // or just rely on the ID check - a robust app should check if at least one superadmin remains.
        const superadmins = await prisma.adminUser.count({ where: { role: 'superadmin' } });
        const userToDelete = await prisma.adminUser.findUnique({ where: { id } });

        if (userToDelete?.role === 'superadmin' && superadmins <= 1) {
            return NextResponse.json({ error: 'Cannot delete the last superadmin' }, { status: 403 });
        }

        await prisma.adminUser.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to delete user', details: error.message },
            { status: 500 }
        );
    }
}
