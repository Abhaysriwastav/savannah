import { prisma } from "@/lib/prisma";
import ProjectsContent from "./ProjectsContent";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const headerSettings = await prisma.pageHeader.findUnique({
        where: { page: 'projects' }
    });

    return <ProjectsContent projects={projects} headerImageUrl={headerSettings?.imageUrl} />;
}
