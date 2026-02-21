import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

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
        await verifyAuth(); // Superadmin only
        const data = await request.json();

        const existing = await prisma.aboutSettings.findFirst();

        let settings;
        if (existing) {
            settings = await prisma.aboutSettings.update({
                where: { id: existing.id },
                data: {
                    storyImageUrl: data.storyImageUrl,
                    headerImageUrl: data.headerImageUrl,
                    missionEn: data.missionEn,
                    missionDe: data.missionDe,
                    visionEn: data.visionEn,
                    visionDe: data.visionDe,
                    storyEn: data.storyEn,
                    storyDe: data.storyDe,
                },
            });
        } else {
            settings = await prisma.aboutSettings.create({
                data: {
                    storyImageUrl: data.storyImageUrl,
                    headerImageUrl: data.headerImageUrl,
                    missionEn: data.missionEn,
                    missionDe: data.missionDe,
                    visionEn: data.visionEn,
                    visionDe: data.visionDe,
                    storyEn: data.storyEn,
                    storyDe: data.storyDe,
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
