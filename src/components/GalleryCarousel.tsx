'use client';

import { useLanguage } from '@/context/LanguageContext';

type Image = { id: string; url: string; title: string | null };

export default function GalleryCarousel({ images }: { images: Image[] }) {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleSlides, setVisibleSlides] = useState(3);
    const sliderRef = useRef<HTMLDivElement>(null);

    // Responsive slides count
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleSlides(1);
            else if (window.innerWidth < 1024) setVisibleSlides(2);
            else setVisibleSlides(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, images.length - visibleSlides);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    };

    useEffect(() => {
        if (images.length === 0) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [images.length, maxIndex]);

    if (images.length === 0) return null;

    return (
        <section className={styles.carouselSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.badge}>{t('gallery.highlights')}</div>
                    <h2>{t('gallery.title')}</h2>
                    <p>{t('gallery.subtitle')}</p>
                </div>

                <div className={styles.carouselWrapper}>
                    <div className={styles.carouselContainer} ref={sliderRef}>
                        <div
                            className={styles.slider}
                            style={{
                                transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
                                width: `${(images.length / visibleSlides) * 100}%`
                            }}
                        >
                            {images.map((image, index) => (
                                <Link
                                    href="/gallery"
                                    key={image.id}
                                    className={styles.slide}
                                    style={{ width: `${100 / images.length}%` }}
                                >
                                    <div className={styles.card3d}>
                                        <div className={styles.imageWrapper}>
                                            <img src={image.url} alt={image.title || `Gallery Image ${index + 1}`} loading="lazy" />
                                            <div className={styles.overlay}>
                                                <span className={styles.viewLink}>{t('gallery.viewInGallery')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <button className={`${styles.navButton} ${styles.prev}`} onClick={prevSlide} aria-label="Previous image">
                        <FiChevronLeft size={24} />
                    </button>
                    <button className={`${styles.navButton} ${styles.next}`} onClick={nextSlide} aria-label="Next image">
                        <FiChevronRight size={24} />
                    </button>
                </div>

                <div className={styles.footer}>
                    <Link href="/gallery" className="btn btn-primary">
                        {t('common.viewFullGallery')} <FiArrowRight style={{ marginLeft: '8px' }} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
