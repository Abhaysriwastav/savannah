'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FiGlobe, FiTrash2, FiEdit2, FiPlus, FiSave, FiX, FiImage } from 'react-icons/fi';

interface Partner {
    id: string;
    name: string;
    logoUrl: string | null;
    createdAt: string;
}

export default function AdminPartners() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form States
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        logoUrl: ''
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/partners');
            if (res.ok) {
                const data = await res.json();
                setPartners(data);
            } else {
                setMessage({ type: 'error', text: 'Failed to fetch partners' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while fetching partners.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (partner: Partner) => {
        setFormData({
            name: partner.name,
            logoUrl: partner.logoUrl || ''
        });
        setEditingId(partner.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData({ name: '', logoUrl: '' });
        setEditingId(null);
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const url = '/api/partners';
            const method = editingId ? 'PUT' : 'POST';
            const payload = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: `Partner ${editingId ? 'updated' : 'added'} successfully!` });
                fetchPartners();
                handleCancelEdit();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Failed to save partner.' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: 'An error occurred while saving.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this partner?')) return;

        try {
            const res = await fetch(`/api/partners?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Partner deleted successfully.' });
                setPartners(partners.filter(p => p.id !== id));
            } else {
                setMessage({ type: 'error', text: 'Failed to delete partner.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while deleting.' });
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading partners...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Trusted Partners</h1>
                    <p>Manage the partner logos displayed in the homepage marquee.</p>
                </div>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        <FiPlus /> Add Partner
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
                        <h2>{editingId ? 'Edit Partner' : 'New Partner'}</h2>
                    </div>
                    <div className={styles.cardBody}>
                        <form onSubmit={handleSave} className={styles.formGrid}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Partner Organization Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className={styles.input}
                                        placeholder="e.g. Global Aid Network"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Logo Image URL (Optional)</label>
                                    <input
                                        type="url"
                                        name="logoUrl"
                                        value={formData.logoUrl}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                    <FiSave /> {isSaving ? 'Saving...' : 'Save Partner'}
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
                {partners.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FiGlobe size={48} />
                        <p>No partners added yet.</p>
                    </div>
                ) : (
                    partners.map((p) => (
                        <div key={p.id} className={styles.adminCard} style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                            {p.logoUrl ? (
                                <img src={p.logoUrl} alt={p.name} style={{ width: '80px', height: '80px', objectFit: 'contain', marginRight: '20px' }} />
                            ) : (
                                <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px', borderRadius: 'var(--radius-md)' }}>
                                    <FiImage size={24} color="var(--text-secondary)" />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{p.name}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                                    Added: {new Date(p.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className={styles.iconBtn} onClick={() => handleEdit(p)} title="Edit">
                                    <FiEdit2 />
                                </button>
                                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(p.id)} title="Delete">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
