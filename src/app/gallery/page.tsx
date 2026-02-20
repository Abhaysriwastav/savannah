import { prisma } from "@/lib/prisma";
import GalleryContent from "./GalleryContent";

export const dynamic = 'force-dynamic';

export default async function Gallery() {
    const images = await prisma.galleryImage.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return <GalleryContent images={images} />;
}
