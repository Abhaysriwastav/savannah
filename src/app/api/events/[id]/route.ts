import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log(`API: Attempting to delete event with ID: ${id}`);

        await verifyAuth('manage_events');
        console.log('API: Auth check passed');

        const deletedEvent = await prisma.event.delete({
            where: { id },
        });

        console.log('API: Event deleted successfully:', deletedEvent.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Delete Event Error:', error);
        return NextResponse.json({
            error: 'Failed to delete event',
            details: error.message
        }, { status: 500 });
    }
}
