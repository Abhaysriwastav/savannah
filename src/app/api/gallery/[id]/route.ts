import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await verifyAuth('manage_gallery');
        const { id } = await params;

        // Get the image first to find its URL
        const image = await prisma.galleryImage.findUnique({
            where: { id }
        });

        if (!image) {
            console.log('API Delete Image: Not Found');
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Attempt to delete file from filesystem
        try {
            if (image.url.startsWith('/uploads/')) {
                const filePath = path.join(process.cwd(), 'public', image.url);
                await unlink(filePath);
                console.log('API: Deleted local file:', filePath);
            }
        } catch (fsError) {
            console.warn('API Warning: Failed to delete file from filesystem:', fsError);
            // Continue anyway to remove from DB
        }

        await prisma.galleryImage.delete({
            where: { id },
        });

        console.log('API: Image record deleted from DB');
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Delete Image Error:', error);
        return NextResponse.json({
            error: 'Failed to delete image',
            details: error.message
        }, { status: 500 });
    }
}
