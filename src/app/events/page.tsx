import styles from "./events.module.css";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiMapPin } from "react-icons/fi";

// Revalidate every 60 seconds or on demand
export const revalidate = 60;

export default async function Events() {
    const events = await prisma.event.findMany({
        orderBy: {
            date: 'asc',
        },
    });

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className="container text-center animate-fade-in">
                    <h1>Upcoming Events</h1>
                    <p className={styles.subtitle}>Join us and make a difference</p>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    {events.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                                <h2>No Upcoming Events</h2>
                                <p>Check back later for new events, or subscribe to our newsletter.</p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.eventsGrid}>
                            {events.map((event: typeof events[0]) => (
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
                                                    {new Date(event.date).toLocaleDateString("en-US", {
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
