import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    try {
        await verifyAuth('manage_messages');
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to fetch messages',
            details: error.message
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await verifyAuth('manage_messages');
        const data = await request.json();
        const { id, status } = data;

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
        }

        const message = await prisma.contactMessage.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(message);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to update message',
            details: error.message
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await verifyAuth('manage_messages');
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.contactMessage.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to delete message',
            details: error.message
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
