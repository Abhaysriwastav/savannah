import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import styles from './projects.module.css';
import { FiTarget, FiArrowRight } from 'react-icons/fi';

export const revalidate = 60;

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className={styles.main}>
            <section className={styles.heroSection}>
                <div className={`container ${styles.heroContent} animate-fade-in`}>
                    <h1>Our Projects</h1>
                    <p className={styles.heroSubtitle}>
                        Discover the impact we are making across communities through our dedicated humanitarian, educational, and integration projects.
                    </p>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    {projects.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiTarget size={48} color="var(--border)" />
                            <h2>No Projects Found</h2>
                            <p>We are currently updating our project portfolio. Please check back soon!</p>
                        </div>
                    ) : (
                        <div className={styles.projectsGrid}>
                            {projects.map((project) => (
                                <div key={project.id} className={`${styles.projectCard} glass-panel`}>
                                    <div className={styles.imageWrapper}>
                                        {project.imageUrl ? (
                                            <img src={project.imageUrl} alt={project.title} className={styles.projectImage} />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <FiTarget size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.contentWrapper}>
                                        <div className={styles.dateBadge}>
                                            {new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                                        </div>
                                        <h2>{project.title}</h2>
                                        <p className={styles.description}>{project.description}</p>

                                        {(project.bullet1 || project.bullet2 || project.bullet3) && (
                                            <ul className={styles.featuresList}>
                                                {project.bullet1 && <li>{project.bullet1}</li>}
                                                {project.bullet2 && <li>{project.bullet2}</li>}
                                                {project.bullet3 && <li>{project.bullet3}</li>}
                                            </ul>
                                        )}

                                        {/* Future proofing for individual project details page */}
                                        <div className={styles.cardFooter}>
                                            <span className={styles.readMore}>Learn more <FiArrowRight /></span>
                                        </div>
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
