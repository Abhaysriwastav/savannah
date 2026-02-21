import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// Public route to fetch partners for the homepage marquee
export async function GET() {
    try {
        const partners = await prisma.partner.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(partners);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
    }
}

// Protected route to create a new partner
export async function POST(request: Request) {
    try {
        await verifyAuth('manage_partners');
        const data = await request.json();
        const { name, logoUrl } = data;

        if (!name) {
            return NextResponse.json({ error: 'Partner name is required' }, { status: 400 });
        }

        const partner = await prisma.partner.create({
            data: {
                name,
                logoUrl
            }
        });

        return NextResponse.json(partner, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to add partner',
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

// Protected route to update an existing partner
export async function PUT(request: Request) {
    try {
        await verifyAuth('manage_partners');
        const data = await request.json();
        const { id, name, logoUrl } = data;

        if (!id || !name) {
            return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
        }

        const partner = await prisma.partner.update({
            where: { id },
            data: { name, logoUrl }
        });

        return NextResponse.json(partner);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to update partner',
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

// Protected route to delete a partner
export async function DELETE(request: Request) {
    try {
        await verifyAuth('manage_partners');
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.partner.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to delete partner',
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
