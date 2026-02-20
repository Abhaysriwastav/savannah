import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import path from 'path';

// Optional: Security check utility
async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');
    if (!token) throw new Error('Unauthorized');
}

export async function POST(request: Request) {
    try {
        await checkAuth();

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const dateStr = formData.get('date') as string;
        const location = formData.get('location') as string;
        const file = formData.get('image') as File | null;

        let imageUrl = null;

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const filename = `event-${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            const filePath = path.join(uploadDir, filename);

            await writeFile(filePath, buffer);
            imageUrl = `/uploads/${filename}`;
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(dateStr),
                location,
                imageUrl,
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
