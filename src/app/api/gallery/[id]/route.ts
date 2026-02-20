import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('savannah_admin_session');
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get the image first to find its URL
        const image = await prisma.galleryImage.findUnique({
            where: { id }
        });

        if (!image) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Attempt to delete file from filesystem
        try {
            if (image.url.startsWith('/uploads/')) {
                const filePath = path.join(process.cwd(), 'public', image.url);
                await unlink(filePath);
            }
        } catch (fsError) {
            console.warn('Failed to delete file from filesystem:', fsError);
            // Continue anyway to remove from DB
        }

        await prisma.galleryImage.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
}
