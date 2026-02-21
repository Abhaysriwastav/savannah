'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './projects.module.css';
import { FiTarget, FiArrowRight, FiInbox } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import SearchBar from '@/components/ui/SearchBar';
import FilterBar from '@/components/ui/FilterBar';

import NextLink from 'next/link';

interface ProjectsContentProps {
    projects: any[];
    headerImageUrl?: string | null;
}

export default function ProjectsContent({ projects: initialProjects, headerImageUrl }: ProjectsContentProps) {
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [projects, setProjects] = useState(initialProjects);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [dynamicCategories, setDynamicCategories] = useState<string[]>(['All', 'Humanitarian Aid', 'Integration', 'Education', 'General']);

    const fetchFilteredProjects = useCallback(async (query: string, category: string) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('search', query);
            if (category !== 'All') params.append('category', category);

            const res = await fetch(`/api/projects?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to fetch filtered projects:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsMounted(true);
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDynamicCategories(['All', ...data]);
                }
            })
            .catch(err => console.error("Failed to fetch dynamic categories:", err));
    }, []);

    useEffect(() => {
        if (isMounted && (searchQuery || selectedCategory !== 'All')) {
            fetchFilteredProjects(searchQuery, selectedCategory);
        } else if (isMounted && !searchQuery && selectedCategory === 'All') {
            setProjects(initialProjects);
        }
    }, [searchQuery, selectedCategory, isMounted, fetchFilteredProjects, initialProjects]);

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
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SearchBar
                            placeholder={t('search.placeholderProjects')}
                            onSearch={setSearchQuery}
                        />
                        <FilterBar
                            categories={dynamicCategories.map(c => c === 'All' ? t('search.all') : (t(`search.categories.${c}`) === `search.categories.${c}` ? c : t(`search.categories.${c}`)))}
                            selectedCategory={selectedCategory === 'All' ? t('search.all') : (t(`search.categories.${selectedCategory}`) === `search.categories.${selectedCategory}` ? selectedCategory : t(`search.categories.${selectedCategory}`))}
                            onSelect={(translatedCat) => {
                                const originalCat = dynamicCategories.find(c =>
                                    (c === 'All' ? t('search.all') : (t(`search.categories.${c}`) === `search.categories.${c}` ? c : t(`search.categories.${c}`))) === translatedCat
                                );
                                if (originalCat) setSelectedCategory(originalCat);
                            }}
                        />
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="spinner"></div>
                            <p>{t('common.loading')}</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiInbox size={48} color="var(--border)" style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
                            <h2>{searchQuery || selectedCategory !== 'All' ? t('search.noResults') : t('projects.noProjects')}</h2>
                            <p>{t('projects.checkBack')}</p>
                        </div>
                    ) : (
                        <div className={styles.projectsGrid}>
                            {projects.map((project: any) => (
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
                                                {isMounted ? new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : ''}
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
