import styles from "./gallery.module.css";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function Gallery() {
    const images = await prisma.galleryImage.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    type GalleryImageItem = typeof images[0];

    // Group images by title, but only include those that HAVE a title
    // to satisfy the "remove other highlights" requirement.
    const groupedImages = images.reduce((acc: Record<string, GalleryImageItem[]>, image: GalleryImageItem) => {
        if (!image.title) return acc; // Skip images without titles (Other Highlights)

        const key = image.title;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(image);
        return acc;
    }, {} as Record<string, GalleryImageItem[]>);

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className="container text-center animate-fade-in">
                    <h1>Image Gallery</h1>
                    <p className={styles.subtitle}>Moments from our journey</p>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    {Object.keys(groupedImages).length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                                <h2>No Gallery Posts Found</h2>
                                <p>Check back later for new pictures from our events.</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxl)' }}>
                            {(Object.entries(groupedImages) as [string, GalleryImageItem[]][]).map(([groupTitle, groupImages]) => (
                                <div key={groupTitle} className={styles.galleryGroup}>
                                    <h2 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)', textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                                        {groupTitle}
                                    </h2>
                                    <div className={styles.galleryMasonry}>
                                        {groupImages.map((image) => (
                                            <div key={image.id} className={styles.galleryItem}>
                                                <div className={styles.imageWrapper}>
                                                    <img
                                                        src={image.url}
                                                        alt={image.title || "Gallery image"}
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
