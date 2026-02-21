'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FiSmile, FiTrash2, FiCheck, FiInbox, FiRefreshCw, FiExternalLink, FiXCircle } from 'react-icons/fi';

interface Volunteer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    city: string | null;
    interests: string[];
    experience: string | null;
    message: string | null;
    status: 'new' | 'contacted' | 'approved' | 'rejected';
    createdAt: string;
}

export default function AdminVolunteers() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'approved' | 'rejected'>('all');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/volunteers');
            if (res.ok) {
                const data = await res.json();
                setVolunteers(data);
            } else {
                setError('Failed to fetch volunteers');
            }
        } catch (err) {
            setError('An error occurred while fetching volunteers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/volunteers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: status as any } : v));
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this volunteer inquiry?')) return;

        try {
            const res = await fetch(`/api/volunteers?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setVolunteers(volunteers.filter(v => v.id !== id));
            }
        } catch (err) {
            alert('Failed to delete volunteer inquiry');
        }
    };

    const filteredVolunteers = volunteers.filter(v => {
        if (filter === 'all') return true;
        return v.status === filter;
    });

    if (isLoading) return <div className={styles.loading}>Loading volunteers...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Volunteers</h1>
                    <p>Manage volunteer sign-ups from the homepage.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={fetchVolunteers} title="Refresh">
                        <FiRefreshCw />
                    </button>
                </div>
            </header>

            <div className={styles.tabs} style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
                {['all', 'new', 'contacted', 'approved', 'rejected'].map(tab => (
                    <button
                        key={tab}
                        className={filter === tab ? styles.activeTab : ''}
                        onClick={() => setFilter(tab as any)}
                        style={{
                            padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                            borderBottom: filter === tab ? '2px solid var(--primary)' : 'none',
                            color: filter === tab ? 'var(--primary)' : 'var(--text-secondary)',
                            textTransform: 'capitalize', whiteSpace: 'nowrap'
                        }}
                    >
                        {tab} ({tab === 'all' ? volunteers.length : volunteers.filter(v => v.status === tab).length})
                    </button>
                ))}
            </div>

            {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}

            <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                {filteredVolunteers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FiSmile size={48} />
                        <p>No volunteer inquiries found.</p>
                    </div>
                ) : (
                    filteredVolunteers.map((vol) => (
                        <div key={vol.id} className={`${styles.adminCard} ${vol.status === 'new' ? styles.newCard : ''}`} style={{ borderLeft: vol.status === 'new' ? '4px solid var(--primary)' : '1px solid var(--border)' }}>
                            <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                                <div>
                                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {vol.status === 'new' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>}
                                        {vol.firstName} {vol.lastName}
                                        <span className={styles.badge} style={{ fontSize: '0.7rem' }}>{vol.status.toUpperCase()}</span>
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px' }}>
                                        <strong>Email:</strong> {vol.email} {vol.phone && <>&bull; <strong>Phone:</strong> {vol.phone}</>} {vol.city && <>&bull; <strong>City:</strong> {vol.city}</>}
                                        <br />Submitted on: {new Date(vol.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {vol.status === 'new' && (
                                        <button className="btn btn-secondary" onClick={() => handleUpdateStatus(vol.id, 'contacted')} title="Mark Contacted">
                                            <FiCheck /> Contacted
                                        </button>
                                    )}
                                    {vol.status === 'contacted' && (
                                        <button className="btn btn-primary" onClick={() => handleUpdateStatus(vol.id, 'approved')} title="Approve">
                                            <FiSmile /> Approve
                                        </button>
                                    )}
                                    {(vol.status === 'new' || vol.status === 'contacted') && (
                                        <button className="btn btn-secondary" onClick={() => handleUpdateStatus(vol.id, 'rejected')} title="Reject">
                                            <FiXCircle /> Reject
                                        </button>
                                    )}
                                    <button className="btn btn-danger" onClick={() => handleDelete(vol.id)} title="Delete">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.cardBody} style={{ marginTop: '15px' }}>
                                {vol.interests.length > 0 && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong>Areas of Interest:</strong>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                                            {vol.interests.map(interest => (
                                                <span key={interest} style={{ padding: '4px 10px', backgroundColor: 'var(--surface-hover)', borderRadius: '15px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {vol.experience && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong>Experience:</strong>
                                        <div style={{ whiteSpace: 'pre-wrap', backgroundColor: 'var(--background-alt)', padding: '12px', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '5px' }}>
                                            {vol.experience}
                                        </div>
                                    </div>
                                )}

                                {vol.message && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong>Personal Message:</strong>
                                        <div style={{ whiteSpace: 'pre-wrap', backgroundColor: 'var(--background-alt)', padding: '12px', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '5px' }}>
                                            {vol.message}
                                        </div>
                                    </div>
                                )}

                                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <a href={`mailto:${vol.email}?subject=Savannah United - Volunteer Inquiry`} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '5px 12px' }}>
                                        <FiExternalLink /> Contact via Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
