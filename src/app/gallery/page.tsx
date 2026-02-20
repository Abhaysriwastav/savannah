import { prisma } from "@/lib/prisma";
import GalleryContent from "./GalleryContent";

export const dynamic = 'force-dynamic';

export default async function Gallery() {
    const images = await prisma.galleryImage.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    const headerSettings = await prisma.pageHeader.findUnique({
        where: { page: 'gallery' }
    });

    return <GalleryContent images={images} headerImageUrl={headerSettings?.imageUrl} />;
}
