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
        const headers = await prisma.pageHeader.findMany();

        // Fetch specialized headers
        const about = await prisma.aboutSettings.findFirst();
        const donations = await prisma.donationSettings.findFirst();

        const result = [...headers];

        if (about?.headerImageUrl) {
            result.push({ page: 'about', imageUrl: about.headerImageUrl } as any);
        }
        if (donations?.headerImageUrl) {
            result.push({ page: 'donations', imageUrl: donations.headerImageUrl } as any);
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch page headers', details: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await checkAuth();
        const data = await request.json();
        const { page, imageUrl } = data;

        if (!page || !imageUrl) {
            return NextResponse.json({ error: 'Page and imageUrl are required' }, { status: 400 });
        }

        let header;

        if (page === 'about') {
            header = await prisma.aboutSettings.updateMany({
                data: { headerImageUrl: imageUrl }
            });
        } else if (page === 'donations') {
            header = await prisma.donationSettings.updateMany({
                data: { headerImageUrl: imageUrl }
            });
        } else {
            header = await prisma.pageHeader.upsert({
                where: { page },
                update: { imageUrl },
                create: { page, imageUrl },
            });
        }

        return NextResponse.json(header);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to save page header',
            details: error.message
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
