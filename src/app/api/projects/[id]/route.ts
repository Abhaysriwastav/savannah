import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id }
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    try {
        const body = await request.json();

        if (!body.title || !body.description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const updatedProject = await prisma.project.update({
            where: { id: params.id },
            data: {
                title: body.title,
                description: body.description,
                bullet1: body.bullet1,
                bullet2: body.bullet2,
                bullet3: body.bullet3,
                imageUrl: body.imageUrl,
            }
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    try {
        await prisma.project.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
