'use client';

import styles from './projects.module.css';
import { FiTarget, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';

import NextLink from 'next/link';

interface ProjectsContentProps {
    projects: any[];
    headerImageUrl?: string | null;
}

export default function ProjectsContent({ projects, headerImageUrl }: ProjectsContentProps) {
    const { t } = useLanguage();

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section
                className={styles.heroSection}
                style={headerImageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${headerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                <div className={`container ${styles.heroContent} animate-fade-in`}>
                    <h1>{t('common.projects')}</h1>
                    <p className={styles.heroSubtitle}>
                        {t('projects.subtitle') || "Discover the impact we are making across communities through our dedicated humanitarian, educational, and integration projects."}
                    </p>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    {projects.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiTarget size={48} color="var(--border)" />
                            <h2>{t('projects.noProjects') || "No Projects Found"}</h2>
                            <p>{t('projects.checkBack') || "We are currently updating our project portfolio. Please check back soon!"}</p>
                        </div>
                    ) : (
                        <div className={styles.projectsGrid}>
                            {projects.map((project) => (
                                <NextLink href={`/projects/${project.id}`} key={project.id} className={styles.projectLink}>
                                    <div className={`${styles.projectCard} glass-panel`}>
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
                                            <p className={styles.description}>
                                                {project.description.length > 180
                                                    ? `${project.description.substring(0, 180)}...`
                                                    : project.description}
                                            </p>

                                            {(project.bullet1 || project.bullet2 || project.bullet3) && (
                                                <ul className={styles.featuresList}>
                                                    {project.bullet1 && <li>{project.bullet1}</li>}
                                                    {project.bullet2 && <li>{project.bullet2}</li>}
                                                    {project.bullet3 && <li>{project.bullet3}</li>}
                                                </ul>
                                            )}

                                            <div className={styles.cardFooter}>
                                                <span className={styles.readMore}>{t('common.readMore') || "Learn more"} <FiArrowRight /></span>
                                            </div>
                                        </div>
                                    </div>
                                </NextLink>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
