'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FiMail, FiTrash2, FiCheck, FiInbox, FiRefreshCw, FiExternalLink } from 'react-icons/fi';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    createdAt: string;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'new' | 'read'>('all');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/messages');
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            } else {
                setError('Failed to fetch messages');
            }
        } catch (err) {
            setError('An error occurred while fetching messages');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/messages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                setMessages(messages.map(m => m.id === id ? { ...m, status: status as any } : m));
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessages(messages.filter(m => m.id !== id));
            }
        } catch (err) {
            alert('Failed to delete message');
        }
    };

    const filteredMessages = messages.filter(m => {
        if (filter === 'all') return true;
        return m.status === filter;
    });

    if (isLoading) return <div className={styles.loading}>Loading inquiries...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <div>
                    <h1>Inquiries</h1>
                    <p>Manage messages received through the contact form.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={fetchMessages} title="Refresh">
                        <FiRefreshCw />
                    </button>
                </div>
            </header>

            <div className={styles.tabs} style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--border)' }}>
                <button
                    className={filter === 'all' ? styles.activeTab : ''}
                    onClick={() => setFilter('all')}
                    style={{ padding: '10px 20px', background: 'none', border: 'bottom', cursor: 'pointer', borderBottom: filter === 'all' ? '2px solid var(--primary)' : 'none', color: filter === 'all' ? 'var(--primary)' : 'var(--text-secondary)' }}
                >
                    All ({messages.length})
                </button>
                <button
                    className={filter === 'new' ? styles.activeTab : ''}
                    onClick={() => setFilter('new')}
                    style={{ padding: '10px 20px', background: 'none', border: 'bottom', cursor: 'pointer', borderBottom: filter === 'new' ? '2px solid var(--primary)' : 'none', color: filter === 'new' ? 'var(--primary)' : 'var(--text-secondary)' }}
                >
                    New ({messages.filter(m => m.status === 'new').length})
                </button>
                <button
                    className={filter === 'read' ? styles.activeTab : ''}
                    onClick={() => setFilter('read')}
                    style={{ padding: '10px 20px', background: 'none', border: 'bottom', cursor: 'pointer', borderBottom: filter === 'read' ? '2px solid var(--primary)' : 'none', color: filter === 'read' ? 'var(--primary)' : 'var(--text-secondary)' }}
                >
                    Read ({messages.filter(m => m.status === 'read').length})
                </button>
            </div>

            {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}

            <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                {filteredMessages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FiInbox size={48} />
                        <p>No messages found.</p>
                    </div>
                ) : (
                    filteredMessages.map((msg) => (
                        <div key={msg.id} className={`${styles.adminCard} ${msg.status === 'new' ? styles.newCard : ''}`} style={{ borderLeft: msg.status === 'new' ? '4px solid var(--primary)' : '1px solid var(--border)' }}>
                            <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {msg.status === 'new' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>}
                                        {msg.subject}
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        From: <strong>{msg.name}</strong> ({msg.email}) &bull; {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {msg.status === 'new' ? (
                                        <button className="btn btn-secondary" onClick={() => handleUpdateStatus(msg.id, 'read')} title="Mark as Read">
                                            <FiCheck /> Read
                                        </button>
                                    ) : (
                                        <button className="btn btn-secondary" onClick={() => handleUpdateStatus(msg.id, 'new')} title="Mark as New">
                                            <FiInbox /> New
                                        </button>
                                    )}
                                    <button className="btn btn-danger" onClick={() => handleDelete(msg.id)} title="Delete">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div style={{ whiteSpace: 'pre-wrap', backgroundColor: 'var(--background-alt)', padding: '15px', borderRadius: '8px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                                    {msg.message}
                                </div>
                                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '5px 12px' }}>
                                        <FiExternalLink /> Reply via Email
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
