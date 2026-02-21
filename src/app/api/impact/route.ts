import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session');
    if (!token) throw new Error('Unauthorized');
}

export async function GET() {
    try {
        const metrics = await prisma.impactMetric.findMany({
            orderBy: { order: 'asc' }
        });

        const projectCount = await prisma.project.count();
        const eventCount = await prisma.event.count();

        // Fetch settings from Database to use totalCount, or fallback to zero
        const donationSettings = await prisma.donationSettings.findFirst();
        const totalDonations = donationSettings?.totalCount || 0;

        // Prepend dynamic stats to the user's manual metrics
        const dynamicMetrics = [
            {
                id: 'dynamic-projects',
                labelEn: 'Projects Completed',
                labelDe: 'Abgeschlossene Projekte',
                value: `${projectCount}+`,
                icon: 'target',
                order: -3
            },
            {
                id: 'dynamic-events',
                labelEn: 'Community Events',
                labelDe: 'Gemeinschaftsveranstaltungen',
                value: `${eventCount}+`,
                icon: 'calendar',
                order: -2
            },
            {
                id: 'dynamic-donations',
                labelEn: 'Donations Raised',
                labelDe: 'Gesammelte Spenden',
                value: `€${totalDonations.toLocaleString()}`,
                icon: 'heart',
                order: -1
            }
        ];

        return NextResponse.json([...dynamicMetrics, ...metrics]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch impact metrics" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await checkAuth();
        const body = await request.json();
        const metric = await prisma.impactMetric.create({
            data: {
                labelEn: body.labelEn,
                labelDe: body.labelDe,
                value: body.value,
                icon: body.icon,
                order: body.order || 0
            }
        });
        return NextResponse.json(metric);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to create impact metric" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await checkAuth();
        const body = await request.json();
        const { id, updatedAt, ...data } = body;
        const updated = await prisma.impactMetric.update({
            where: { id },
            data
        });
        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to update impact metric" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await checkAuth();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.impactMetric.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to delete impact metric" }, { status: 500 });
    }
}
