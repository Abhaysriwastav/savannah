import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, email, subject, message } = data;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const newMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message,
                status: 'new'
            }
        });

        return NextResponse.json({ success: true, message: 'Message sent successfully', id: newMessage.id });
    } catch (error: any) {
        console.error('Contact API Error:', error);
        return NextResponse.json({
            error: 'Failed to send message',
            details: error.message
        }, { status: 500 });
    }
}
