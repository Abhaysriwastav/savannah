import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// Public route to fetch testimonials for the homepage
export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(testimonials);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

// Protected route to create a new testimonial
export async function POST(request: Request) {
    try {
        await verifyAuth('manage_testimonials');
        const data = await request.json();
        const { author, role, quote, imageUrl } = data;

        if (!author || !quote) {
            return NextResponse.json({ error: 'Author and quote are required' }, { status: 400 });
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                author,
                role,
                quote,
                imageUrl
            }
        });

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to create testimonial',
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

// Protected route to update a testimonial
export async function PUT(request: Request) {
    try {
        await verifyAuth('manage_testimonials');
        const data = await request.json();
        const { id, author, role, quote, imageUrl } = data;

        if (!id || !author || !quote) {
            return NextResponse.json({ error: 'ID, author, and quote are required' }, { status: 400 });
        }

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: { author, role, quote, imageUrl }
        });

        return NextResponse.json(testimonial);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to update testimonial',
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

// Protected route to delete a testimonial
export async function DELETE(request: Request) {
    try {
        await verifyAuth('manage_testimonials');
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.testimonial.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to delete testimonial',
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
