import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// Public route to submit a volunteer form
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { firstName, lastName, email, phone, city, interests, experience, message } = data;

        if (!firstName || !lastName || !email) {
            return NextResponse.json({ error: 'First name, last name, and email are required' }, { status: 400 });
        }

        const volunteer = await prisma.volunteer.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                city,
                interests: interests || [],
                experience,
                message,
                status: 'new'
            }
        });

        return NextResponse.json(volunteer, { status: 201 });
    } catch (error: any) {
        console.error('Volunteer submission error:', error);
        return NextResponse.json({ error: 'Failed to submit volunteer form' }, { status: 500 });
    }
}

// Protected route for admins to fetch volunteers
export async function GET() {
    try {
        await verifyAuth('manage_volunteers');
        const volunteers = await prisma.volunteer.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(volunteers);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to fetch volunteers',
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

// Protected route to update volunteer status
export async function PATCH(request: Request) {
    try {
        await verifyAuth('manage_volunteers');
        const data = await request.json();
        const { id, status } = data;

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
        }

        const volunteer = await prisma.volunteer.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(volunteer);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to update volunteer',
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

// Protected route to delete a volunteer inquiry
export async function DELETE(request: Request) {
    try {
        await verifyAuth('manage_volunteers');
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.volunteer.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to delete volunteer',
        }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
