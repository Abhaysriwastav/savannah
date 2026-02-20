'use client';

import { useState, useEffect } from 'react';
import styles from './adminDonations.module.css';
import { FiSave, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

interface DonationSettings {
    bankName: string;
    accountName: string;
    iban: string;
    bic: string;
    whatsappPhone: string;
    headerImageUrl: string;
    totalCount: number;
}

export default function AdminDonations() {
    const [settings, setSettings] = useState<DonationSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isIncrementing, setIsIncrementing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form states
    const [formData, setFormData] = useState({
        bankName: '',
        accountName: '',
        iban: '',
        bic: '',
        whatsappPhone: '',
        imageUrl: '',
        headerImageUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedHeaderFile, setSelectedHeaderFile] = useState<File | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/donations');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
                setFormData({
                    bankName: data.bankName || '',
                    accountName: data.accountName || '',
                    iban: data.iban || '',
                    bic: data.bic || '',
                    whatsappPhone: data.whatsappPhone || '',
                    imageUrl: data.imageUrl || '',
                    headerImageUrl: data.headerImageUrl || ''
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleHeaderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedHeaderFile(e.target.files[0]);
        }
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            let finalImageUrl = formData.imageUrl;
            let finalHeaderImageUrl = formData.headerImageUrl;

            // Upload Content Image
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('images', selectedFile);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    finalImageUrl = Array.isArray(data) ? data[0].url : data.url;
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

            const res = await fetch('/api/donations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    imageUrl: finalImageUrl,
                    headerImageUrl: finalHeaderImageUrl
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
                setFormData(prev => ({ ...prev, imageUrl: finalImageUrl }));
                setSelectedFile(null); // Clear selection
                fetchSettings(); // Refresh Data
            } else {
                const errorData = await res.json();
                setMessage({ type: 'error', text: errorData.error || 'Failed to update details.' });
            }
        } catch (error: any) {
            console.error("Save Error:", error);
            setMessage({ type: 'error', text: `An error occurred: ${error.message || 'Unknown error'}` });
        } finally {
            setIsSaving(false);
        }
    };

    const handleIncrementDonation = async () => {
        if (!confirm("Are you sure you want to approve and increment the public donation counter?")) return;

        setIsIncrementing(true);
        try {
            const res = await fetch('/api/donations/increment', {
                method: 'POST',
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Donation counter +1 incremented!' });
                fetchSettings();
            } else {
                setMessage({ type: 'error', text: 'Failed to increment counter.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to increment counter.' });
        } finally {
            setIsIncrementing(false);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading donation settings...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Manage Donations</h1>
                    <p className={styles.subtitle}>Update bank details and approve transfer receipts.</p>
                </div>
            </header>

            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.grid}>
                {/* Statistics & Approval Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Donation Approvals</h2>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Total Approved Donations</span>
                            <span className={styles.statValue}>{settings?.totalCount || 0}</span>
                        </div>

                        <p className={styles.hint}>
                            When you receive a valid receipt image on WhatsApp from a donor, click below to increment the public counter.
                        </p>

                        <button
                            className={`btn btn-primary ${styles.fullWidth}`}
                            onClick={handleIncrementDonation}
                            disabled={isIncrementing}
                        >
                            {isIncrementing ? <FiRefreshCw className="spin" /> : <FiCheckCircle />}
                            +1 Approve New Donation
                        </button>
                    </div>
                </div>

                {/* Bank Details Form Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Page Content & Bank Details</h2>
                    </div>
                    <div className={styles.cardBody}>
                        <form onSubmit={handleSaveSettings} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Page Header Background Image</label>
                                {formData.headerImageUrl && !selectedHeaderFile && (
                                    <div style={{ marginBottom: '10px' }}>
                                        <img src={formData.headerImageUrl} alt="Current Header" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', objectFit: 'cover', aspectRatio: '21/9' }} />
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleHeaderFileChange} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Donation Page Content Image</label>
                                {formData.imageUrl && !selectedFile && (
                                    <div style={{ marginBottom: '10px' }}>
                                        <img src={formData.imageUrl} alt="Current Content" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', objectFit: 'cover', aspectRatio: '16/9' }} />
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </div>

                            <hr style={{ margin: 'var(--spacing-md) 0', border: 'none', borderTop: '1px solid var(--border)' }} />

                            <div className={styles.formGroup}>
                                <label>Bank Name</label>
                                <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Account Holder Name</label>
                                <input type="text" name="accountName" value={formData.accountName} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>IBAN</label>
                                <input type="text" name="iban" value={formData.iban} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>BIC / SWIFT</label>
                                <input type="text" name="bic" value={formData.bic} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>WhatsApp Phone Number (with Country Code e.g., +491234567)</label>
                                <input type="text" name="whatsappPhone" value={formData.whatsappPhone} onChange={handleInputChange} required />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                {isSaving ? 'Saving...' : <><FiSave /> Save Details</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
