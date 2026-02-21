'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FiSave, FiArrowLeft, FiImage } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminAbout() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [missionEn, setMissionEn] = useState('');
    const [missionDe, setMissionDe] = useState('');
    const [visionEn, setVisionEn] = useState('');
    const [visionDe, setVisionDe] = useState('');
    const [storyEn, setStoryEn] = useState('');
    const [storyDe, setStoryDe] = useState('');
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
                setMissionEn(data.missionEn || '');
                setMissionDe(data.missionDe || '');
                setVisionEn(data.visionEn || '');
                setVisionDe(data.visionDe || '');
                setStoryEn(data.storyEn || '');
                setStoryDe(data.storyDe || '');
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
                    headerImageUrl: finalHeaderImageUrl,
                    missionEn,
                    missionDe,
                    visionEn,
                    visionDe,
                    storyEn,
                    storyDe
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading settings...</div>;

    return (
        <div className="animate-fade-in">
            <header className={styles.pageHeader}>
                <div>
                    <h1>Manage About Us</h1>
                </div>
            </header>

            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`} style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '12px', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className={styles.formGrid}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Mission & Vision */}
                    <div className={styles.adminCard}>
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Mission & Vision</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Mission (English)</label>
                                <textarea
                                    value={missionEn}
                                    onChange={(e) => setMissionEn(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mission (German)</label>
                                <textarea
                                    value={missionDe}
                                    onChange={(e) => setMissionDe(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Vision (English)</label>
                                <textarea
                                    value={visionEn}
                                    onChange={(e) => setVisionEn(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Vision (German)</label>
                                <textarea
                                    value={visionDe}
                                    onChange={(e) => setVisionDe(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className={styles.adminCard}>
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Page Images</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Header Background Banner</label>
                                <input type="file" onChange={handleHeaderFileChange} accept="image/*" />
                                {headerImageUrl && <img src={headerImageUrl} style={{ width: '100px', borderRadius: '8px', marginTop: '10px' }} />}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Story / Influence Image</label>
                                <input type="file" onChange={handleStoryFileChange} accept="image/*" />
                                {imageUrl && <img src={imageUrl} style={{ width: '100px', borderRadius: '8px', marginTop: '10px' }} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Story */}
                <div className={styles.adminCard}>
                    <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Our Story</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className={styles.formGroup}>
                            <label>Our Story Content (English)</label>
                            <textarea
                                value={storyEn}
                                onChange={(e) => setStoryEn(e.target.value)}
                                rows={10}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Unsere Geschichte (German)</label>
                            <textarea
                                value={storyDe}
                                onChange={(e) => setStoryDe(e.target.value)}
                                rows={10}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                        {isSaving ? 'Saving Changes...' : <><FiSave /> Save All Settings</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
