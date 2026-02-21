'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FiPlus, FiTrash2, FiSave, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function AdminImpact() {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const res = await fetch('/api/impact');
            if (res.ok) {
                const data = await res.json();
                // Filter out the dynamically generated metrics so they aren't edited or saved back
                const editableMetrics = data.filter((m: any) => !m.id || !m.id.startsWith('dynamic-'));
                setMetrics(editableMetrics);
            }
        } catch (error) {
            console.error("Failed to fetch metrics", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addMetric = () => {
        setMetrics([...metrics, { labelEn: '', labelDe: '', value: '', icon: 'users', order: metrics.length }]);
    };

    const removeMetric = async (index: number, id?: string) => {
        if (id) {
            if (!confirm('Are you sure you want to delete this metric?')) return;
            const res = await fetch(`/api/impact?id=${id}`, { method: 'DELETE' });
            if (!res.ok) {
                alert('Failed to delete metric');
                return;
            }
        }
        const newMetrics = [...metrics];
        newMetrics.splice(index, 1);
        setMetrics(newMetrics);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const updatableMetrics = metrics.filter((m: any) => !m.id || !m.id.startsWith('dynamic-'));
            for (const metric of updatableMetrics) {
                const method = metric.id && !metric.id.startsWith('new-') ? 'PUT' : 'POST';
                const res = await fetch('/api/impact', {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(metric),
                });

                if (!res.ok) {
                    const errObj = await res.json().catch(() => ({}));
                    throw new Error(errObj.error || errObj.details || `Server responded with ${res.status}`);
                }
            }
            setMessage({ type: 'success', text: 'Impact metrics updated successfully!' });
            fetchMetrics();
        } catch (error: any) {
            setMessage({ type: 'error', text: `Error: ${error.message || 'An error occurred while saving.'}` });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading metrics...</div>;

    return (
        <div className="animate-fade-in">
            <header className={styles.pageHeader}>
                <h1>Manage Impact Dashboard</h1>
                <button onClick={addMetric} className="btn btn-primary">
                    <FiPlus /> Add New Stat
                </button>
            </header>

            {message.text && (
                <div style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '12px', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
                    {message.text}
                </div>
            )}

            <div className={styles.formGrid}>
                {metrics.map((metric, index) => (
                    <div key={metric.id || index} className={styles.adminCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700 }}>Stat #{index + 1}</h3>
                            <button onClick={() => removeMetric(index, metric.id)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <FiTrash2 /> Delete
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className={styles.formGroup}>
                                <label>Label (English)</label>
                                <input
                                    type="text"
                                    value={metric.labelEn}
                                    onChange={(e) => {
                                        const newM = [...metrics];
                                        newM[index].labelEn = e.target.value;
                                        setMetrics(newM);
                                    }}
                                    placeholder="e.g., Students Impacted"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Label (German)</label>
                                <input
                                    type="text"
                                    value={metric.labelDe}
                                    onChange={(e) => {
                                        const newM = [...metrics];
                                        newM[index].labelDe = e.target.value;
                                        setMetrics(newM);
                                    }}
                                    placeholder="e.g., Wirkungsgrad (Schüler)"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Value</label>
                                <input
                                    type="text"
                                    value={metric.value}
                                    onChange={(e) => {
                                        const newM = [...metrics];
                                        newM[index].value = e.target.value;
                                        setMetrics(newM);
                                    }}
                                    placeholder="e.g., 500+ or 95%"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Icon</label>
                                <select
                                    value={metric.icon}
                                    onChange={(e) => {
                                        const newM = [...metrics];
                                        newM[index].icon = e.target.value;
                                        setMetrics(newM);
                                    }}
                                >
                                    <option value="users">People / Users</option>
                                    <option value="book">Education / Books</option>
                                    <option value="heart">Charity / Heart</option>
                                    <option value="globe">Global / World</option>
                                    <option value="star">Achievement / Star</option>
                                    <option value="target">Impact / Target</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {metrics.length > 0 && (
                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                    <button onClick={handleSave} className="btn btn-primary" disabled={isSaving} style={{ padding: '1rem 4rem' }}>
                        {isSaving ? 'Saving...' : <><FiSave /> Save All Impact Metrics</>}
                    </button>
                </div>
            )}

            {metrics.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px' }}>
                    <FiTrendingUp size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: '#64748b' }}>No impact metrics added yet. Click "+ Add New Stat" to begin.</p>
                </div>
            )}
        </div>
    );
}
