import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { unlink } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session');
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { imageIds } = body;

        if (!Array.isArray(imageIds) || imageIds.length === 0) {
            return NextResponse.json({ error: 'No images selected' }, { status: 400 });
        }

        // Get the images first to find their URLs
        const images = await prisma.galleryImage.findMany({
            where: { id: { in: imageIds } }
        });

        if (images.length === 0) {
            return NextResponse.json({ error: 'Images not found' }, { status: 404 });
        }

        // Attempt to delete files from filesystem
        for (const image of images) {
            try {
                if (image.url.startsWith('/uploads/')) {
                    const filePath = path.join(process.cwd(), 'public', image.url);
                    await unlink(filePath);
                }
            } catch (fsError) {
                console.warn(`Failed to delete file ${image.url} from filesystem:`, fsError);
            }
        }

        // Delete from database
        await prisma.galleryImage.deleteMany({
            where: { id: { in: imageIds } },
        });

        return NextResponse.json({ success: true, count: images.length });
    } catch (error) {
        console.error('Bulk delete error:', error);
        return NextResponse.json({ error: 'Failed to delete images' }, { status: 500 });
    }
}
