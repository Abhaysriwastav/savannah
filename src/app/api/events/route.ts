import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

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
            // Upload to Vercel Blob
            const blob = await put(file.name, file, {
                access: 'public',
                addRandomSuffix: true,
            });
            imageUrl = blob.url;
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
