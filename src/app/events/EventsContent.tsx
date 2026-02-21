'use client';

import { useState, useEffect, useCallback } from "react";
import styles from "./events.module.css";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiInbox } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar from "@/components/ui/FilterBar";

interface EventsContentProps {
    events: any[];
    headerImageUrl?: string | null;
}

export default function EventsContent({ events: initialEvents, headerImageUrl }: EventsContentProps) {
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [events, setEvents] = useState(initialEvents);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [dynamicCategories, setDynamicCategories] = useState<string[]>(['All', 'Humanitarian Aid', 'Integration', 'Education', 'General']);

    const fetchFilteredEvents = useCallback(async (query: string, category: string) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('search', query);
            if (category !== 'All') params.append('category', category);

            const res = await fetch(`/api/events?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch filtered events:", error);
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
            fetchFilteredEvents(searchQuery, selectedCategory);
        } else if (isMounted && !searchQuery && selectedCategory === 'All') {
            setEvents(initialEvents);
        }
    }, [searchQuery, selectedCategory, isMounted, fetchFilteredEvents, initialEvents]);

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section
                className={styles.pageHeader}
                style={headerImageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${headerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                <div className="container text-center animate-fade-in">
                    <h1>{t('events.title')}</h1>
                    <p className={styles.subtitle}>{t('events.joinDifference')}</p>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <SearchBar
                            placeholder={t('search.placeholderEvents')}
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
                    ) : events.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                                <FiInbox size={48} color="var(--primary)" style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
                                <h2>{searchQuery || selectedCategory !== 'All' ? t('search.noResults') : t('events.noEvents')}</h2>
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
                                                    {isMounted ? new Date(event.date).toLocaleDateString(undefined, {
                                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                    }) : ''}
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
