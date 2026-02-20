import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiArrowLeft } from "react-icons/fi";
import styles from "./eventDetail.module.css";

export const revalidate = 60; // Revalidate every minute

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    const event = await prisma.event.findUnique({
        where: { id: resolvedParams.id }
    });

    if (!event) {
        notFound();
    }

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className="container animate-fade-in">
                    <Link href="/events" className={styles.backLink}>
                        <FiArrowLeft /> Back to all events
                    </Link>
                    <h1>{event.title}</h1>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    <div className={`${styles.contentWrapper} glass-panel`}>
                        <div className={styles.imageSection}>
                            {event.imageUrl ? (
                                <img src={event.imageUrl} alt={event.title} className={styles.eventImage} />
                            ) : (
                                <div className={styles.imagePlaceholder}>
                                    No Cover Image
                                </div>
                            )}
                        </div>

                        <div className={styles.detailsSection}>
                            <div className={styles.metaInfo}>
                                <div className={styles.metaItem}>
                                    <FiCalendar className={styles.icon} size={24} />
                                    <div>
                                        <strong>Date & Time</strong>
                                        <p>{new Date(event.date).toLocaleDateString("en-US", {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}</p>
                                    </div>
                                </div>

                                <div className={styles.metaItem}>
                                    <FiMapPin className={styles.icon} size={24} />
                                    <div>
                                        <strong>Location</strong>
                                        <p>{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.descriptionSection}>
                                <h2>About this Event</h2>
                                <div className={styles.descriptionText}>
                                    {event.description.split('\n').map((paragraph: string, index: number) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.actionSection}>
                                <Link href="/contact" className="btn btn-primary">
                                    Contact Us for Details
                                </Link>
                                <Link href="/donations" className="btn btn-outline">
                                    Support our Cause
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
