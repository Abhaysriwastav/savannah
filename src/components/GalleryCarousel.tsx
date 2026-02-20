'use client';

import { useState, useEffect } from 'react';
import styles from './GalleryCarousel.module.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type Image = { id: string; url: string; title: string | null };

export default function GalleryCarousel({ images }: { images: Image[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll logic
    useEffect(() => {
        if (images.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    if (images.length === 0) return null;

    return (
        <section className={styles.carouselSection}>
            <div className="container">
                <div className={styles.header}>
                    <h2>Gallery Highlights</h2>
                    <p>A glimpse into our recent activities and community outreach programs.</p>
                </div>

                <div className={styles.carouselContainer}>
                    <button className={`${styles.navButton} ${styles.prev}`} onClick={prevSlide} aria-label="Previous image">
                        <FiChevronLeft size={24} />
                    </button>

                    <div className={styles.slider} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {images.map((image, index) => (
                            <div key={image.id} className={styles.slide}>
                                <div className={styles.imageWrapper}>
                                    <img src={image.url} alt={image.title || `Gallery Image ${index + 1}`} loading="lazy" />
                                </div>
                                {image.title && (
                                    <div className={styles.caption}>
                                        <p>{image.title}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button className={`${styles.navButton} ${styles.next}`} onClick={nextSlide} aria-label="Next image">
                        <FiChevronRight size={24} />
                    </button>

                    <div className={styles.dots}>
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
