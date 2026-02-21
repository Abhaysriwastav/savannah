'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { FiSave, FiPhone, FiMail, FiMapPin, FiMap } from 'react-icons/fi';

export default function AdminContact() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        locationUrl: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/contact-settings');
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    locationUrl: data.locationUrl || ''
                });
            }
        } catch (error) {
            console.error("Failed to fetch contact settings", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/contact-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Contact details updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update contact details.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while saving.' });
        } finally {
            setIsSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading contact info...</div>;

    return (
        <div className="animate-fade-in">
            <header className={styles.pageHeader}>
                <h1>Contact Page Settings</h1>
            </header>

            {message.text && (
                <div style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '12px', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
                    {message.text}
                </div>
            )}

            <div className={styles.adminCard} style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSave} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label><FiMail /> Public Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g., info@savannahunited.de"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label><FiPhone /> Public Phone Number</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="e.g., +49 123 456789"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label><FiMapPin /> Physical Address / Office Location</label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="e.g., Sonnenallee 123, 12045 Berlin"
                            rows={3}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label><FiMap /> Google Maps Embed URL</label>
                        <input
                            type="text"
                            value={formData.locationUrl}
                            onChange={(e) => setFormData({ ...formData, locationUrl: e.target.value })}
                            placeholder="Paste the 'src' link from a Google Maps iframe"
                        />
                        <small style={{ color: '#64748b' }}>Go to Google Maps - Share - Embed map - Copy only the &apos;src&apos; attribute value.</small>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ padding: '0.8rem 2.5rem' }}>
                            {isSaving ? 'Saving...' : <><FiSave /> Save Contact Info</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
