import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

import { verifyAuth } from '@/lib/auth';

// Handle both singular and plural versions of the Vercel Blob token
const getBlobToken = () => process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOBS_READ_WRITE_TOKEN;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');

        const where: any = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category && category !== 'All') {
            where.category = category;
        }

        const events = await prisma.event.findMany({
            where,
            orderBy: { date: 'asc' }
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("Events fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await verifyAuth('manage_events');

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string || 'General';
        const dateStr = formData.get('date') as string;
        const location = formData.get('location') as string;
        const file = formData.get('image') as File | null;

        let imageUrl = null;

        if (file) {
            const blob = await put(file.name, file, {
                access: 'public',
                token: getBlobToken(),
                addRandomSuffix: true,
            });
            imageUrl = blob.url;
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                category,
                date: new Date(dateStr),
                location,
                imageUrl,
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error: any) {
        console.error("Event creation error:", error);
        return NextResponse.json({ error: 'Failed to create event', details: error.message }, { status: 500 });
    }
}
