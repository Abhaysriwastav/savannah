import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session');
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Handle both singular and plural versions of the Vercel Blob token
        const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOBS_READ_WRITE_TOKEN;

        const formData = await request.formData();
        const files = formData.getAll('images') as File[];
        const title = formData.get('title') as string | null;

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No images provided' }, { status: 400 });
        }

        const uploadedImages = [];

        for (const file of files) {
            // Upload to Vercel Blob - restore 'public' as store is now public
            const blob = await put(file.name, file, {
                access: 'public',
                token: blobToken,
                addRandomSuffix: true,
            });

            const image = await prisma.galleryImage.create({
                data: {
                    url: blob.url,
                    title: title || null,
                },
            });
            uploadedImages.push(image);
        }

        return NextResponse.json(uploadedImages, { status: 201 });
    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({
            error: 'Failed to upload image',
            details: error.message
        }, { status: 500 });
    }
}
