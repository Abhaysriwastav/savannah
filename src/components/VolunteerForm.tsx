'use client';

import { useState } from 'react';
import styles from './VolunteerForm.module.css';

const INTEREST_OPTIONS = [
    'Event Planning & Coordination',
    'Social Media & Marketing',
    'Mentoring & Youth Outreach',
    'Fundraising & Grants',
    'Logistics & Operations',
    'Other (Please specify in message)'
];

export default function VolunteerForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        interests: [] as string[],
        experience: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInterestToggle = (interest: string) => {
        setFormData(prev => {
            if (prev.interests.includes(interest)) {
                return { ...prev, interests: prev.interests.filter(i => i !== interest) };
            } else {
                return { ...prev, interests: [...prev.interests, interest] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            const res = await fetch('/api/volunteers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus({ type: 'success', text: 'Thank you! Your volunteer inquiry has been successfully submitted. Our team will contact you shortly.' });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    city: '',
                    interests: [],
                    experience: '',
                    message: ''
                });
            } else {
                const data = await res.json();
                setStatus({ type: 'error', text: data.error || 'Failed to submit form. Please try again later.' });
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'A network error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Become a Volunteer</h2>
                <p className={styles.subtitle}>
                    Join our incredible community of dedicated individuals. Whether you have specific skills to share or just a willingness to help out, we'd love to hear from you.
                </p>
            </div>

            {status.text && (
                <div className={`${styles.alert} ${styles[status.type]}`}>
                    {status.text}
                </div>
            )}

            {!status.text || status.type === 'error' ? (
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName">First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Jane"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="lastName">Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="jane@example.com"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="+49 123 45678"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="city">City / Region</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="e.g., Berlin"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Areas of Interest</label>
                        <div className={styles.checkboxContainer}>
                            {INTEREST_OPTIONS.map(interest => (
                                <label key={interest} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={formData.interests.includes(interest)}
                                        onChange={() => handleInterestToggle(interest)}
                                    />
                                    {interest}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="experience">Previous Volunteer/Professional Experience</label>
                        <textarea
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className={styles.textarea}
                            placeholder="Briefly describe any relevant experience or skills you bring..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="message">Why do you want to volunteer with Savannah United?</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className={styles.textarea}
                            placeholder="Let us know what inspires you!"
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            ) : null}
        </div>
    );
}
