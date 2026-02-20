'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../adminProjects.module.css';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

export default function EditProject() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        bullet1: '',
        bullet2: '',
        bullet3: '',
        imageUrl: ''
    });

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    bullet1: data.bullet1 || '',
                    bullet2: data.bullet2 || '',
                    bullet3: data.bullet3 || '',
                    imageUrl: data.imageUrl || ''
                });
            } else {
                setMessage({ type: 'error', text: 'Failed to load project details.' });
            }
        } catch (error: any) {
            console.error("Fetch error:", error);
            setMessage({ type: 'error', text: `Failed to load: ${error.message || 'Unknown error'}` });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            let finalImageUrl = formData.imageUrl;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('images', selectedFile); // The API expects 'images' key
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

            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, imageUrl: finalImageUrl }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Project updated successfully!' });
                setFormData(prev => ({ ...prev, imageUrl: finalImageUrl }));
                setSelectedFile(null); // Clear selection
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.details || data.error || 'Failed to update project.' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: `An error occurred: ${error.message || 'Unknown error'}` });
        } finally {
            setIsSaving(false);
            router.refresh();
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading project details...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <Link href="/admin/projects" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', marginBottom: '10px', textDecoration: 'none' }}>
                        <FiArrowLeft /> Back to Projects
                    </Link>
                    <h1 className={styles.title}>Edit Project</h1>
                </div>
            </header>

            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Project Details</h2>
                </div>
                <div className={styles.cardBody}>
                    <form onSubmit={handleSave} className={styles.form}>

                        <div className={styles.formGroup}>
                            <label>Project Featured Image</label>
                            {formData.imageUrl && !selectedFile && (
                                <div style={{ marginBottom: '10px' }}>
                                    <img src={formData.imageUrl} alt="Current Cover" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', objectFit: 'cover', aspectRatio: '16/9' }} />
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            <small style={{ color: 'var(--text-secondary)' }}>Upload a new image to replace the current one.</small>
                        </div>

                        <hr style={{ margin: 'var(--spacing-md) 0', border: 'none', borderTop: '1px solid var(--border)' }} />

                        <div className={styles.formGroup}>
                            <label>Project Title *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Project Summary Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                required
                            />
                        </div>

                        <hr style={{ margin: 'var(--spacing-md) 0', border: 'none', borderTop: '1px solid var(--border)' }} />

                        <h4>List Checkmarks (Optional Impact points)</h4>
                        <div className={styles.formGroup}>
                            <label>Bullet 1</label>
                            <input type="text" name="bullet1" value={formData.bullet1} onChange={handleInputChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Bullet 2</label>
                            <input type="text" name="bullet2" value={formData.bullet2} onChange={handleInputChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Bullet 3</label>
                            <input type="text" name="bullet3" value={formData.bullet3} onChange={handleInputChange} />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : <><FiSave /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
