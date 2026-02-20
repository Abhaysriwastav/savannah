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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/about-settings');
            if (res.ok) {
                const data = await res.json();
                setImageUrl(data.storyImageUrl || '');
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            let finalImageUrl = imageUrl;

            // Upload new image if selected
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('images', selectedFile);

                // Use the generic upload API (not tagged for gallery)
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    finalImageUrl = Array.isArray(data) ? data[0].url : data.url;
                } else {
                    const errorData = await uploadRes.json();
                    throw new Error(errorData.details || errorData.error || "Failed to upload image.");
                }
            }

            const res = await fetch('/api/about-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storyImageUrl: finalImageUrl }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'About Us settings updated successfully!' });
                setImageUrl(finalImageUrl);
                setSelectedFile(null);
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
                    <h2><FiImage /> Community Impact Section</h2>
                </div>
                <div className={styles.cardBody}>
                    <form onSubmit={handleSave} className={styles.formGrid}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label>Background Image</label>

                            {imageUrl && !selectedFile && (
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                    <img
                                        src={imageUrl}
                                        alt="Community Impact"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            {selectedFile && (
                                <div style={{ padding: '1rem', backgroundColor: 'rgba(224, 122, 95, 0.1)', borderRadius: '8px', border: '1px dashed var(--primary)', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--primary)', fontWeight: 600 }}>New image selected: {selectedFile.name}</p>
                                    <button type="button" onClick={() => setSelectedFile(null)} className="btn btn-outline" style={{ marginTop: '0.5rem', padding: '0.3rem 0.6rem' }}>Cancel Selection</button>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                            />
                            <small style={{ color: 'var(--text-secondary)' }}>
                                This image will represent our community impact on the About Us page.
                            </small>
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
