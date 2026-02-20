import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session');
    if (!token) throw new Error('Unauthorized');
}

export async function GET() {
    try {
        const settings = await prisma.aboutSettings.findFirst();
        return NextResponse.json(settings || {});
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch settings', details: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await checkAuth();
        const data = await request.json();

        const existing = await prisma.aboutSettings.findFirst();

        let settings;
        if (existing) {
            settings = await prisma.aboutSettings.update({
                where: { id: existing.id },
                data: {
                    storyImageUrl: data.storyImageUrl,
                },
            });
        } else {
            settings = await prisma.aboutSettings.create({
                data: {
                    storyImageUrl: data.storyImageUrl,
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to save settings',
            details: error.message
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
