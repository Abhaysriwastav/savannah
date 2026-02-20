'use client';

import styles from "./gallery.module.css";
import { useLanguage } from "@/context/LanguageContext";

interface GalleryContentProps {
    images: any[];
}

export default function GalleryContent({ images }: GalleryContentProps) {
    const { t } = useLanguage();

    // Group images by title, assigning those without a title to localized "Other Highlights".
    const groupedImages = images.reduce((acc: Record<string, any[]>, image: any) => {
        const key = image.title || t('gallery.otherHighlights');
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(image);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className="container text-center animate-fade-in">
                    <h1>{t('common.gallery')}</h1>
                    <p className={styles.subtitle}>{t('gallery.subtitle')}</p>
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
                            {Object.entries(groupedImages).map(([groupTitle, groupImages]) => (
                                <div key={groupTitle} className={styles.galleryGroup}>
                                    <h2 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)', textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                                        {groupTitle}
                                    </h2>
                                    <div className={styles.galleryMasonry}>
                                        {groupImages.map((image: any) => (
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
