import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch all categories from Events
        const events = await prisma.event.findMany({
            select: { category: true }
        });

        // Fetch all categories from Projects
        const projects = await prisma.project.findMany({
            select: { category: true }
        });

        // Combine and extract unique strings
        const categorySet = new Set([
            'Humanitarian Aid',
            'Integration',
            'Education',
            'General'
        ]);

        events.forEach((e: any) => { if (e.category) categorySet.add(e.category); });
        projects.forEach((p: any) => { if (p.category) categorySet.add(p.category); });

        // Sort alphabetical
        const sortedCategories = Array.from(categorySet).sort();

        return NextResponse.json(sortedCategories);
    } catch (error) {
        console.error("Categories fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
