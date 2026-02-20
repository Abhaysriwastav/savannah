'use client';

import styles from "./events.module.css";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface EventsContentProps {
    events: any[];
}

export default function EventsContent({ events }: EventsContentProps) {
    const { t } = useLanguage();

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className="container text-center animate-fade-in">
                    <h1>{t('events.title')}</h1>
                    <p className={styles.subtitle}>{t('events.joinDifference')}</p>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    {events.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                                <h2>{t('events.noEvents')}</h2>
                                <p>{t('events.noEventsDesc')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.eventsGrid}>
                            {events.map((event: any) => (
                                <Link href={`/events/${event.id}`} key={event.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={`${styles.eventCard} glass-panel`}>
                                        <div className={styles.eventImage}>
                                            {event.imageUrl ? (
                                                <img src={event.imageUrl} alt={event.title} />
                                            ) : (
                                                <div className={styles.imagePlaceholder}>No Image</div>
                                            )}
                                        </div>
                                        <div className={styles.eventContent}>
                                            <h3 style={{ color: 'var(--text-primary)' }}>{event.title}</h3>
                                            <div className={styles.eventMeta}>
                                                <span className={styles.metaItem}>
                                                    <FiCalendar className={styles.icon} />
                                                    {new Date(event.date).toLocaleDateString(undefined, {
                                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                </span>
                                                <span className={styles.metaItem}>
                                                    <FiMapPin className={styles.icon} />
                                                    {event.location}
                                                </span>
                                            </div>
                                            <p className={styles.eventDescription}>{event.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
