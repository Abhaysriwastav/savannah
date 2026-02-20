import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token');
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await request.formData();
        const files = formData.getAll('images') as File[];
        const title = formData.get('title') as string | null;

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No images provided' }, { status: 400 });
        }

        const uploadedImages = [];
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const filePath = path.join(uploadDir, filename);

            await writeFile(filePath, buffer);
            const url = `/uploads/${filename}`;

            const image = await prisma.galleryImage.create({
                data: {
                    url,
                    title: title || null, // Apply title to all uploaded batch for simplicity
                },
            });
            uploadedImages.push(image);
        }

        return NextResponse.json(uploadedImages, { status: 201 });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
