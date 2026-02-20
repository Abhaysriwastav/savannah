import { prisma } from "@/lib/prisma";
import HomeContent from "./HomeContent";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    take: 3,
  });

  const galleryImages = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  const latestProject = await prisma.project.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <HomeContent
      events={events}
      galleryImages={galleryImages}
      latestProject={latestProject}
    />
  );
}
