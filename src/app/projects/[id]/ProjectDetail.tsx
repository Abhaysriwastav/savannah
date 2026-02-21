'use client';

import { useState, useEffect } from 'react';
import styles from '../projects.module.css';
import { FiArrowLeft, FiTarget, FiHeart, FiShare2 } from 'react-icons/fi';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface ProjectDetailProps {
    project: any;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    return (
        <div className={styles.detailMain}>
            <section
                className={styles.detailHero}
                style={project.imageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${project.imageUrl})` } : {}}
            >
                <div className="container animate-fade-in">
                    <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none', marginBottom: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
                        <FiArrowLeft /> {t('common.backTo')} {t('common.projects')}
                    </Link>
                    <h1>{project.title}</h1>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className={styles.detailGrid}>
                        <div className={styles.detailBody}>
                            {project.imageUrl && (
                                <div className={styles.detailImage}>
                                    <img src={project.imageUrl} alt={project.title} />
                                </div>
                            )}
                            <h2>{t('projects.aboutProject') || "About this Project"}</h2>
                            <p>{project.description}</p>
                        </div>

                        <div className={styles.detailSidebar}>
                            <div className={`${styles.sidebarCard} glass-panel`}>
                                <h3><FiTarget /> {t('projects.keyGoals') || "Key Goals"}</h3>
                                <ul className={styles.sidebarList}>
                                    {project.bullet1 && <li>{project.bullet1}</li>}
                                    {project.bullet2 && <li>{project.bullet2}</li>}
                                    {project.bullet3 && <li>{project.bullet3}</li>}
                                </ul>
                            </div>

                            <div className={`${styles.sidebarCard} glass-panel`}>
                                <h3><FiHeart /> {t('projects.howToHelp') || "How to Support"}</h3>
                                <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                                    {t('projects.supportDesc') || "Your support helps us continue our impact. Consider donating or sharing this project."}
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Link href="/donations" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                                        {t('common.donateNow')}
                                    </Link>
                                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FiShare2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
