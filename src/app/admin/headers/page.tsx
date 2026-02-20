'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FiSave, FiLayers, FiImage, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface PageHeader {
    id?: string;
    page: string;
    imageUrl: string;
}

const PAGES = [
    { id: 'about', label: 'About Us Page' },
    { id: 'donations', label: 'Donation Page' },
    { id: 'events', label: 'Events Page' },
    { id: 'projects', label: 'Projects Page' },
    { id: 'gallery', label: 'Gallery Page' },
    { id: 'contact', label: 'Contact Us Page' },
];

export default function AdminPageHeaders() {
    const [headers, setHeaders] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

    useEffect(() => {
        fetchHeaders();
    }, []);

    const fetchHeaders = async () => {
        try {
            const res = await fetch('/api/page-headers');
            if (res.ok) {
                const data: PageHeader[] = await res.json();
                const headerMap: Record<string, string> = {};
                data.forEach(h => {
                    headerMap[h.page] = h.imageUrl;
                });
                setHeaders(headerMap);
            }
        } catch (error) {
            console.error("Failed to fetch headers", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (page: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFiles(prev => ({ ...prev, [page]: e.target.files![0] }));
        }
    };

    const handleSave = async (page: string) => {
        const file = selectedFiles[page];
        if (!file && !headers[page]) return;

        setIsSaving(prev => ({ ...prev, [page]: true }));
        setMessage({ type: '', text: '' });

        try {
            let imageUrl = headers[page] || '';

            if (file) {
                const uploadData = new FormData();
                uploadData.append('images', file);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    imageUrl = Array.isArray(data) ? data[0].url : data.url;
                }
            }

            const res = await fetch('/api/page-headers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page, imageUrl }),
            });

            if (res.ok) {
                setHeaders(prev => ({ ...prev, [page]: imageUrl }));
                setSelectedFiles(prev => ({ ...prev, [page]: null }));
                setMessage({ type: 'success', text: `Header for ${page} updated successfully!` });
            } else {
                setMessage({ type: 'error', text: `Failed to update header for ${page}.` });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred during save.' });
        } finally {
            setIsSaving(prev => ({ ...prev, [page]: false }));
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading page headers...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <div>
                    <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', marginBottom: '10px', textDecoration: 'none' }}>
                        <FiArrowLeft /> Back to Dashboard
                    </Link>
                    <h1>Page Headers</h1>
                    <p>Customize the background images for the header section of each page.</p>
                </div>
            </header>

            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.grid}>
                {PAGES.map((page) => (
                    <div key={page.id} className={styles.adminCard}>
                        <div className={styles.cardHeader}>
                            <h2><FiImage /> {page.label}</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {headers[page.id] && !selectedFiles[page.id] && (
                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                        <img src={headers[page.id]} alt={page.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}

                                {selectedFiles[page.id] && (
                                    <div style={{ padding: '0.5rem', backgroundColor: 'rgba(224, 122, 95, 0.1)', borderRadius: '8px', border: '1px dashed var(--primary)', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem' }}>New: {selectedFiles[page.id]?.name}</p>
                                    </div>
                                )}

                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(page.id, e)} />

                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleSave(page.id)}
                                    disabled={isSaving[page.id] || (!selectedFiles[page.id] && !headers[page.id])}
                                >
                                    {isSaving[page.id] ? 'Saving...' : <><FiSave /> Save {page.label} Header</>}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
