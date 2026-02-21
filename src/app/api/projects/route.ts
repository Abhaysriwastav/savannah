import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');

        const where: any = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category && category !== 'All') {
            where.category = category;
        }

        const projects = await prisma.project.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error("Projects fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await verifyAuth('manage_projects');

        const formData = await request.formData();

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const bullet1 = formData.get('bullet1') as string;
        const bullet2 = formData.get('bullet2') as string;
        const bullet3 = formData.get('bullet3') as string;
        const imageUrl = formData.get('imageUrl') as string;

        // Basic validation
        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                category: category || 'General',
                bullet1,
                bullet2,
                bullet3,
                imageUrl,
            },
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error: any) {
        console.error("Project creation error:", error);
        return NextResponse.json(
            { error: "Failed to create project", details: error.message },
            { status: 500 }
        );
    }
}
