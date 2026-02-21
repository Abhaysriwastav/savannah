'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FiMessageCircle, FiTrash2, FiEdit2, FiPlus, FiSave, FiX, FiImage } from 'react-icons/fi';

interface Testimonial {
    id: string;
    author: string;
    role: string | null;
    quote: string;
    imageUrl: string | null;
    createdAt: string;
}

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form States
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        author: '',
        role: '',
        quote: '',
        imageUrl: ''
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/testimonials');
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            } else {
                setMessage({ type: 'error', text: 'Failed to fetch testimonials' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while fetching testimonials.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (testimonial: Testimonial) => {
        setFormData({
            author: testimonial.author,
            role: testimonial.role || '',
            quote: testimonial.quote,
            imageUrl: testimonial.imageUrl || ''
        });
        setEditingId(testimonial.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData({ author: '', role: '', quote: '', imageUrl: '' });
        setEditingId(null);
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const url = '/api/testimonials';
            const method = editingId ? 'PUT' : 'POST';
            const payload = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: `Testimonial ${editingId ? 'updated' : 'added'} successfully!` });
                fetchTestimonials();
                handleCancelEdit();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Failed to save testimonial.' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: 'An error occurred while saving.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Testimonial deleted successfully.' });
                setTestimonials(testimonials.filter(t => t.id !== id));
            } else {
                setMessage({ type: 'error', text: 'Failed to delete testimonial.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while deleting.' });
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading testimonials...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Community Voices</h1>
                    <p>Manage testimonials to display on the homepage.</p>
                </div>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        <FiPlus /> Add Testimonial
                    </button>
                )}
            </header>

            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            {isEditing && (
                <div className={styles.adminCard} style={{ marginBottom: '30px' }}>
                    <div className={styles.cardHeader}>
                        <h2>{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                    </div>
                    <div className={styles.cardBody}>
                        <form onSubmit={handleSave} className={styles.formGrid}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Author Name *</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                        className={styles.input}
                                        placeholder="e.g. Maria Johnson"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Role / Detail (Optional)</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="e.g. Program Beneficiary or Volunteer"
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Profile Image URL (Optional)</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Quote / Testimonial *</label>
                                <textarea
                                    name="quote"
                                    value={formData.quote}
                                    onChange={handleInputChange}
                                    required
                                    className={styles.textarea}
                                    style={{ minHeight: '100px' }}
                                    placeholder="Enter their quote here..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                    <FiSave /> {isSaving ? 'Saving...' : 'Save Testimonial'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                                    <FiX /> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.grid}>
                {testimonials.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FiMessageCircle size={48} />
                        <p>No testimonials added yet.</p>
                    </div>
                ) : (
                    testimonials.map((t) => (
                        <div key={t.id} className={styles.adminCard}>
                            <div className={styles.cardHeader} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                {t.imageUrl ? (
                                    <img src={t.imageUrl} alt={t.author} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                        <FiImage size={24} />
                                    </div>
                                )}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{t.author}</h3>
                                    {t.role && <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}>{t.role}</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button className={styles.iconBtn} onClick={() => handleEdit(t)} title="Edit">
                                        <FiEdit2 />
                                    </button>
                                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(t.id)} title="Delete">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <blockquote style={{ fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: '15px', margin: '10px 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    "{t.quote}"
                                </blockquote>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '15px', textAlign: 'right' }}>
                                    Added: {new Date(t.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
