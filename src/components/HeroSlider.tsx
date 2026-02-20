'use client';

import { useState, useEffect } from 'react';
import styles from './HeroSlider.module.css';

const images = [
    '/slider/homeslider1.jpg',
    '/slider/homeslider2.jpg',
    '/slider/homeslider3.jpg'
];

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 6000); // 6 seconds per slide
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.sliderContainer}>
            {images.map((img, index) => (
                <div
                    key={img}
                    className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}
            <div className={styles.overlay}></div>
        </div>
    );
}
