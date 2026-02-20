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
        return NextResponse.json(headers);
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

        const header = await prisma.pageHeader.upsert({
            where: { page },
            update: { imageUrl },
            create: { page, imageUrl },
        });

        return NextResponse.json(header);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to save page header',
            details: error.message
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
