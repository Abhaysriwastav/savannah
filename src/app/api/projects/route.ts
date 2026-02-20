import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
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
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const newProject = await prisma.project.create({
            data: {
                title: body.title,
                description: body.description,
                bullet1: body.bullet1,
                bullet2: body.bullet2,
                bullet3: body.bullet3,
                imageUrl: body.imageUrl,
            },
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error("Create project error:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}
