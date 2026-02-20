import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectDetail from "./ProjectDetail";

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id }
    });

    if (!project) {
        notFound();
    }

    return <ProjectDetail project={project} />;
}
