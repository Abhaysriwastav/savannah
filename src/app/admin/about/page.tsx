'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FiSave, FiArrowLeft, FiImage } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminAbout() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imageUrl, setImageUrl] = useState('');
    const [headerImageUrl, setHeaderImageUrl] = useState('');
    const [selectedStoryFile, setSelectedStoryFile] = useState<File | null>(null);
    const [selectedHeaderFile, setSelectedHeaderFile] = useState<File | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/about-settings');
            if (res.ok) {
                const data = await res.json();
                setImageUrl(data.storyImageUrl || '');
                setHeaderImageUrl(data.headerImageUrl || '');
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedStoryFile(e.target.files[0]);
        }
    };

    const handleHeaderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedHeaderFile(e.target.files[0]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            let finalStoryImageUrl = imageUrl;
            let finalHeaderImageUrl = headerImageUrl;

            // Upload Story Image
            if (selectedStoryFile) {
                const uploadData = new FormData();
                uploadData.append('images', selectedStoryFile);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    finalStoryImageUrl = Array.isArray(data) ? data[0].url : data.url;
                }
            }

            // Upload Header Image
            if (selectedHeaderFile) {
                const uploadData = new FormData();
                uploadData.append('images', selectedHeaderFile);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    finalHeaderImageUrl = Array.isArray(data) ? data[0].url : data.url;
                }
            }

            const res = await fetch('/api/about-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storyImageUrl: finalStoryImageUrl,
                    headerImageUrl: finalHeaderImageUrl
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'About Us settings updated successfully!' });
                setImageUrl(finalStoryImageUrl);
                setHeaderImageUrl(finalHeaderImageUrl);
                setSelectedStoryFile(null);
                setSelectedHeaderFile(null);
            } else {
                const errorData = await res.json();
                setMessage({ type: 'error', text: errorData.error || 'Failed to update settings.' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: `An error occurred: ${error.message || 'Unknown error'}` });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading settings...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <div>
                    <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', marginBottom: '10px', textDecoration: 'none' }}>
                        <FiArrowLeft /> Back to Dashboard
                    </Link>
                    <h1>About Us Settings</h1>
                </div>
            </header>

            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.adminCard} style={{ maxWidth: '600px' }}>
                <div className={styles.cardHeader}>
                    <h2><FiImage /> Header & Impact Images</h2>
                </div>
                <div className={styles.cardBody}>
                    <form onSubmit={handleSave} className={styles.formGrid}>
                        {/* Page Header Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                            <label style={{ fontWeight: 700, fontSize: '1.1rem' }}>Page Header Background Image</label>
                            {headerImageUrl && !selectedHeaderFile && (
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                    <img src={headerImageUrl} alt="Header Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                            {selectedHeaderFile && (
                                <div style={{ padding: '1rem', backgroundColor: 'rgba(224, 122, 95, 0.1)', borderRadius: '8px', border: '1px dashed var(--primary)', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--primary)', fontWeight: 600 }}>New header selected: {selectedHeaderFile.name}</p>
                                    <button type="button" onClick={() => setSelectedHeaderFile(null)} className="btn btn-outline" style={{ marginTop: '0.5rem', padding: '0.3rem 0.6rem' }}>Cancel</button>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleHeaderFileChange} />
                            <small style={{ color: 'var(--text-secondary)' }}>This image will appear behind the "About Savannah United" title.</small>
                        </div>

                        {/* Story Image Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ fontWeight: 700, fontSize: '1.1rem' }}>Community Impact Image</label>

                            {imageUrl && !selectedStoryFile && (
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                    <img src={imageUrl} alt="Community Impact" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}

                            {selectedStoryFile && (
                                <div style={{ padding: '1rem', backgroundColor: 'rgba(224, 122, 95, 0.1)', borderRadius: '8px', border: '1px dashed var(--primary)', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--primary)', fontWeight: 600 }}>New impact image selected: {selectedStoryFile.name}</p>
                                    <button type="button" onClick={() => setSelectedStoryFile(null)} className="btn btn-outline" style={{ marginTop: '0.5rem', padding: '0.3rem 0.6rem' }}>Cancel</button>
                                </div>
                            )}

                            <input type="file" accept="image/*" onChange={handleStoryFileChange} />
                            <small style={{ color: 'var(--text-secondary)' }}>This image is shown in the "Our Impact" section.</small>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ marginTop: '1rem' }}>
                            {isSaving ? 'Saving...' : <><FiSave /> Update About Us</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
