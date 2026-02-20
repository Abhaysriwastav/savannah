'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../admin.module.css';

export default function NewEvent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formPayload = new FormData();
        formPayload.append('title', formData.title);
        formPayload.append('description', formData.description);
        formPayload.append('date', formData.date);
        formPayload.append('location', formData.location);
        if (imageFile) {
            formPayload.append('image', imageFile);
        }

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                body: formPayload,
            });

            if (res.ok) {
                router.push('/admin/events');
                router.refresh();
            } else {
                const data = await res.json();
                alert(`Failed to create event: ${data.details || data.error || 'Unknown error'}`);
            }
        } catch (err: any) {
            alert(`Error creating event: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1>Add New Event</h1>
                <Link href="/admin/events" className="btn btn-outline">
                    Cancel
                </Link>
            </div>

            <div className={styles.adminCard} style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="title">Event Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="date">Date & Time</label>
                        <input
                            type="datetime-local"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            required
                            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="image">Event Image (Optional)</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}
