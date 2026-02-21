'use client';

import { useState, useEffect } from "react";
import Link from "next/image";
import NextLink from "next/link";
import styles from "./page.module.css";
import { FiHeart, FiUsers, FiBookOpen, FiCalendar, FiMapPin, FiTarget } from "react-icons/fi";
import GalleryCarousel from "@/components/GalleryCarousel";
import HeroSlider from "@/components/HeroSlider";
import { useLanguage } from "@/context/LanguageContext";

interface HomeContentProps {
    events: any[];
    galleryImages: any[];
    latestProject: any;
}

export default function HomeContent({ events, galleryImages, latestProject }: { events: any[], galleryImages: any[], latestProject: any }) {
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    <HeroSlider />
                </div>

                <div className={`container ${styles.heroContent} animate-fade-in`}>
                    <div className={styles.heroText}>
                        <div className={styles.welcomeSubtitle}>
                            <span>{t('hero.welcome')}</span>
                        </div>
                        <h1>{t('hero.title')}</h1>
                        <p>{t('hero.subtitle')}</p>
                        <div className={styles.heroActions}>
                            <NextLink href="/donations" className="btn btn-primary">
                                {t('common.donate')}
                            </NextLink>
                            <NextLink href="/about-us" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                                {t('common.learnMore')}
                            </NextLink>
                        </div>
                    </div>

                    <div className={`${styles.statsCards} glass-panel`}>
                        <div className={styles.stat}>
                            <FiHeart size={32} color="var(--primary)" />
                            <h3>{t('hero.aid')}</h3>
                            <p>{t('hero.aidDesc')}</p>
                        </div>
                        <div className={styles.stat}>
                            <FiUsers size={32} color="var(--primary)" />
                            <h3>{t('hero.integration')}</h3>
                            <p>{t('hero.integrationDesc')}</p>
                        </div>
                        <div className={styles.stat}>
                            <FiBookOpen size={32} color="var(--primary)" />
                            <h3>{t('hero.education')}</h3>
                            <p>{t('hero.educationDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Dashboard Section */}
            <ImpactSection />

            {/* Featured Project Section */}
            {latestProject && (
                <section className={`section ${styles.projectSection}`}>
                    <div className="container">
                        <div className={styles.projectGrid}>
                            <div className={styles.projectImage}>
                                {latestProject.imageUrl ? (
                                    <img
                                        src={latestProject.imageUrl}
                                        alt={latestProject.title}
                                        className={styles.dynamicProjectImage}
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        {latestProject.title}
                                    </div>
                                )}
                            </div>
                            <div className={styles.projectInfo}>
                                <span className={styles.tag}>{t('projects.latest')}</span>
                                <h2>{latestProject.title}</h2>
                                <p>
                                    {latestProject.description.length > 250
                                        ? `${latestProject.description.substring(0, 250)}...`
                                        : latestProject.description}
                                </p>
                                <ul className={styles.projectFeatures}>
                                    {latestProject.bullet1 && <li>{latestProject.bullet1}</li>}
                                    {latestProject.bullet2 && <li>{latestProject.bullet2}</li>}
                                    {latestProject.bullet3 && <li>{latestProject.bullet3}</li>}
                                </ul>
                                <NextLink href="/projects" className="btn btn-primary">
                                    {t('common.viewAll')} {t('common.projects')}
                                </NextLink>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Carousel Section */}
            <GalleryCarousel images={galleryImages} />

            {/* Upcoming Events Section */}
            <section className={`section ${styles.projectSection}`}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <h2>{t('events.title')}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{t('events.subtitle')}</p>
                    </div>

                    <div className={styles.homeEventsGrid}>
                        {events.length === 0 ? (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>{t('events.noEvents')}</p>
                        ) : (
                            events.map((event: any) => (
                                <NextLink href={`/events/${event.id}`} key={event.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={`${styles.homeEventCard} glass-panel`}>
                                        <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--border)' }}>
                                            {event.imageUrl ? (
                                                <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', backgroundColor: 'rgba(0,0,0,0.05)' }}>No Image</div>
                                            )}
                                        </div>
                                        <div style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>{event.title}</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FiCalendar color="var(--primary)" />
                                                    {isMounted ? new Date(event.date).toLocaleDateString() : ''}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiMapPin color="var(--primary)" /> {event.location}</span>
                                            </div>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
                                        </div>
                                    </div>
                                </NextLink>
                            ))
                        )}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <NextLink href="/events" className="btn btn-outline">
                            {t('events.allEvents')}
                        </NextLink>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container text-center">
                    <h2>{t('cta.title')}</h2>
                    <p>{t('cta.subtitle')}</p>
                    <div className={styles.ctaGrid}>
                        <div className={`${styles.ctaCard} glass-panel`}>
                            <h3>{t('donations.receipt')}</h3>
                            <p>{t('donations.whatsappDesc')}</p>
                            <NextLink href="/donations" className="btn btn-primary">{t('common.donate')}</NextLink>
                        </div>
                        <div className={`${styles.ctaCard} glass-panel`}>
                            <h3>{t('cta.volunteer')}</h3>
                            <p>{t('cta.volunteerDesc')}</p>
                            <NextLink href="/contact" className="btn btn-outline">{t('cta.volunteerBtn')}</NextLink>
                        </div>
                        <div className={`${styles.ctaCard} glass-panel`}>
                            <h3>{t('cta.scholarship')}</h3>
                            <p>{t('cta.scholarshipDesc')}</p>
                            <NextLink href="/contact" className="btn btn-outline">{t('cta.scholarshipBtn')}</NextLink>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function ImpactSection() {
    const { t, language } = useLanguage();
    const [metrics, setMetrics] = useState<any[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch('/api/impact');
                if (res.ok) {
                    const data = await res.json();
                    setMetrics(data);
                }
            } catch (error) {
                console.error('Failed to fetch metrics');
            }
        };
        fetchMetrics();
        setIsVisible(true);
    }, []);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'users': return <FiUsers size={30} color="var(--primary)" />;
            case 'target': return <FiTarget size={30} color="#84AC96" />;
            case 'calendar': return <FiCalendar size={30} color="#F2CC8F" />;
            case 'heart': return <FiHeart size={30} color="#3D5A80" />;
            default: return <FiHeart size={30} color="var(--primary)" />;
        }
    };

    const getBgColor = (iconName: string) => {
        switch (iconName) {
            case 'users': return 'rgba(224, 122, 95, 0.1)';
            case 'target': return 'rgba(132, 172, 150, 0.1)';
            case 'calendar': return 'rgba(242, 204, 143, 0.1)';
            case 'heart': return 'rgba(61, 90, 128, 0.1)';
            default: return 'rgba(224, 122, 95, 0.1)';
        }
    };

    if (!metrics || metrics.length === 0) return null;

    return (
        <section className={`${styles.impactSection} section`}>
            <div className="container">
                <div className={styles.impactHeader}>
                    <h2>{t('impact.title')}</h2>
                    <p>{t('impact.subtitle')}</p>
                </div>

                <div className={styles.impactGrid}>
                    {metrics.map((metric: any) => (
                        <div key={metric.id} className={styles.impactCard}>
                            <div className={styles.impactIcon} style={{ background: getBgColor(metric.icon) }}>
                                {getIcon(metric.icon)}
                            </div>
                            <div className={styles.impactNumber}>
                                {isVisible ? (
                                    metric.value.includes('+') ? (
                                        <Counter end={parseInt(metric.value.replace(/\D/g, ''))} suffix="+" />
                                    ) : metric.value.startsWith('€') ? (
                                        <Counter end={parseInt(metric.value.replace(/\D/g, ''))} prefix="€" />
                                    ) : (
                                        <Counter end={parseInt(metric.value.replace(/\D/g, ''))} />
                                    )
                                ) : '0'}
                            </div>
                            <div className={styles.impactLabel}>{language === 'en' ? metric.labelEn : metric.labelDe}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Counter({ end, duration = 2000, suffix = '', prefix = '' }: { end: number, duration?: number, suffix?: string, prefix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}
