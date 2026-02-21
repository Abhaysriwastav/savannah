'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './TestimonialCarousel.module.css';
import Tilt from 'react-parallax-tilt';

interface Testimonial {
    id: string;
    author: string;
    role: string | null;
    quote: string;
    imageUrl: string | null;
}

export default function TestimonialCarousel() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch('/api/testimonials');
                if (res.ok) {
                    const data = await res.json();
                    setTestimonials(data);
                }
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            }
        };
        fetchTestimonials();
    }, []);

    // Auto-advance
    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = setInterval(() => {
            handleNext();
        }, 8000); // 8 seconds per slide
        return () => clearInterval(timer);
    }, [currentIndex, testimonials.length]);

    if (testimonials.length === 0) {
        return null; // Don't render Section if there's no data
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { type: 'spring' as const, stiffness: 300, damping: 30 }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3 }
        })
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1 === testimonials.length ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 < 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleDotClick = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section style={{ margin: 'var(--spacing-xxl) 0', position: 'relative', zIndex: 2 }}>
            <div className={`container ${styles.carouselContainer}`}>
                <h2 className={styles.title}>Community Voices</h2>

                <div className={styles.viewport}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} transitionSpeed={2000} glareEnable={true} glareMaxOpacity={0.1}>
                                <div className={styles.testimonialCard}>
                                    <svg className={styles.quoteIcon} width="64" height="64" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>

                                    <p className={styles.quote}>"{currentTestimonial.quote}"</p>

                                    <div className={styles.authorInfo}>
                                        {currentTestimonial.imageUrl ? (
                                            <img src={currentTestimonial.imageUrl} alt={currentTestimonial.author} className={styles.avatar} />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                {currentTestimonial.author.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className={styles.authorName}>{currentTestimonial.author}</span>
                                            {currentTestimonial.role && <span className={styles.authorRole}>{currentTestimonial.role}</span>}
                                        </div>
                                    </div>
                                </div>
                            </Tilt>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {testimonials.length > 1 && (
                    <div className={styles.controls}>
                        <button className={styles.controlBtn} onClick={handlePrev} aria-label="Previous">
                            <FiChevronLeft size={24} />
                        </button>

                        <div className={styles.indicators}>
                            {testimonials.map((_, index) => (
                                <div
                                    key={index}
                                    className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                                    onClick={() => handleDotClick(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button className={styles.controlBtn} onClick={handleNext} aria-label="Next">
                            <FiChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
